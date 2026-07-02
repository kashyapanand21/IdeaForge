<?php

use App\Events\IdeaVoted;
use App\Models\Idea;
use App\Models\IdeaVote;
use App\Models\Team;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Support\Facades\Event;

test('team member can upvote a shared idea', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $user->id, 'role' => 'owner']);
    $idea = Idea::factory()->shared($team)->create();

    $this->actingAs($user)
        ->post(route('ideas.vote', $idea), ['vote' => 'up'])
        ->assertRedirect();

    $this->assertDatabaseHas('idea_votes', [
        'idea_id' => $idea->id,
        'user_id' => $user->id,
        'vote' => 'up',
    ]);
});

test('team member can downvote a shared idea', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $user->id, 'role' => 'owner']);
    $idea = Idea::factory()->shared($team)->create();

    $this->actingAs($user)
        ->post(route('ideas.vote', $idea), ['vote' => 'down'])
        ->assertRedirect();

    $this->assertDatabaseHas('idea_votes', [
        'idea_id' => $idea->id,
        'user_id' => $user->id,
        'vote' => 'down',
    ]);
});

test('voting the same way twice removes the vote', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $user->id, 'role' => 'owner']);
    $idea = Idea::factory()->shared($team)->create();

    $this->actingAs($user)->post(route('ideas.vote', $idea), ['vote' => 'up']);
    $this->actingAs($user)->post(route('ideas.vote', $idea), ['vote' => 'up']);

    $this->assertDatabaseMissing('idea_votes', [
        'idea_id' => $idea->id,
        'user_id' => $user->id,
    ]);
});

test('voting differently switches the vote', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $user->id, 'role' => 'owner']);
    $idea = Idea::factory()->shared($team)->create();

    $this->actingAs($user)->post(route('ideas.vote', $idea), ['vote' => 'up']);
    $this->actingAs($user)->post(route('ideas.vote', $idea), ['vote' => 'down']);

    $this->assertDatabaseHas('idea_votes', [
        'idea_id' => $idea->id,
        'user_id' => $user->id,
        'vote' => 'down',
    ]);

    expect(IdeaVote::where('idea_id', $idea->id)->where('user_id', $user->id)->count())->toBe(1);
});

test('voting is rate limited after 10 attempts per minute', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $user->id, 'role' => 'owner']);
    $idea = Idea::factory()->shared($team)->create();

    for ($i = 0; $i < 10; $i++) {
        $this->actingAs($user)->post(route('ideas.vote', $idea), ['vote' => 'up']);
    }

    $this->actingAs($user)
        ->post(route('ideas.vote', $idea), ['vote' => 'up'])
        ->assertStatus(429);
});

test('non-team member cannot vote on a shared idea', function () {
    $owner = User::factory()->create();
    $outsider = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $owner->id, 'role' => 'owner']);
    $idea = Idea::factory()->shared($team)->create();

    $this->actingAs($outsider)
        ->post(route('ideas.vote', $idea), ['vote' => 'up'])
        ->assertForbidden();

    $this->assertDatabaseMissing('idea_votes', [
        'idea_id' => $idea->id,
        'user_id' => $outsider->id,
    ]);
});

test('cannot vote on a private idea', function () {
    $user = User::factory()->create();
    $idea = Idea::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->post(route('ideas.vote', $idea), ['vote' => 'up'])
        ->assertForbidden();
});

test('voting dispatches IdeaVoted event', function () {
    Event::fake();

    $owner = User::factory()->create();
    $voter = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $owner->id, 'role' => 'owner']);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $voter->id, 'role' => 'member']);
    $idea = Idea::factory()->shared($team)->create(['user_id' => $owner->id]);

    $this->actingAs($voter)->post(route('ideas.vote', $idea), ['vote' => 'up']);

    Event::assertDispatched(IdeaVoted::class, fn ($event) => $event->vote->idea_id === $idea->id);
});

test('toggling a vote off does not dispatch IdeaVoted', function () {
    $owner = User::factory()->create();
    $voter = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $owner->id, 'role' => 'owner']);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $voter->id, 'role' => 'member']);
    $idea = Idea::factory()->shared($team)->create(['user_id' => $owner->id]);

    $this->actingAs($voter)->post(route('ideas.vote', $idea), ['vote' => 'up']);

    Event::fake();

    $this->actingAs($voter)->post(route('ideas.vote', $idea), ['vote' => 'up']);

    Event::assertNotDispatched(IdeaVoted::class);
});

test('idea owner receives a database notification when someone votes', function () {
    $owner = User::factory()->create();
    $voter = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $owner->id, 'role' => 'owner']);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $voter->id, 'role' => 'member']);
    $idea = Idea::factory()->shared($team)->create(['user_id' => $owner->id]);

    $this->actingAs($voter)->post(route('ideas.vote', $idea), ['vote' => 'up']);

    expect($owner->fresh()->notifications()->count())->toBe(1);
});

test('idea owner does not get notified when voting on their own idea', function () {
    $owner = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $owner->id, 'role' => 'owner']);
    $idea = Idea::factory()->shared($team)->create(['user_id' => $owner->id]);

    $this->actingAs($owner)->post(route('ideas.vote', $idea), ['vote' => 'up']);

    expect($owner->fresh()->notifications()->count())->toBe(0);
});
