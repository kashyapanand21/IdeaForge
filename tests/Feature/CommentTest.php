<?php

use App\Events\CommentPosted;
use App\Models\Comment;
use App\Models\Idea;
use App\Models\Team;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Support\Facades\Event;

test('team member can post a comment on a shared idea', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $user->id, 'role' => 'owner']);
    $idea = Idea::factory()->shared($team)->create();

    $this->actingAs($user)
        ->post(route('comments.store', $idea), ['body' => 'This is a comment'])
        ->assertRedirect();

    $this->assertDatabaseHas('comments', [
        'idea_id' => $idea->id,
        'user_id' => $user->id,
        'body' => 'This is a comment',
    ]);
});

test('team member can reply to a top-level comment', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $user->id, 'role' => 'owner']);
    $idea = Idea::factory()->shared($team)->create();
    $comment = Comment::factory()->create(['idea_id' => $idea->id, 'user_id' => $user->id]);

    $this->actingAs($user)
        ->post(route('comments.reply', $comment), ['body' => 'This is a reply'])
        ->assertRedirect();

    $this->assertDatabaseHas('comments', [
        'idea_id' => $idea->id,
        'parent_id' => $comment->id,
        'body' => 'This is a reply',
    ]);
});

test('cannot reply to a reply', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $user->id, 'role' => 'owner']);
    $idea = Idea::factory()->shared($team)->create();
    $parent = Comment::factory()->create(['idea_id' => $idea->id, 'user_id' => $user->id]);
    $reply = Comment::factory()->create(['idea_id' => $idea->id, 'user_id' => $user->id, 'parent_id' => $parent->id]);

    $this->actingAs($user)
        ->post(route('comments.reply', $reply), ['body' => 'Nested reply attempt'])
        ->assertStatus(400);
});

test('author can update their own comment', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $user->id, 'role' => 'owner']);
    $idea = Idea::factory()->shared($team)->create();
    $comment = Comment::factory()->create(['idea_id' => $idea->id, 'user_id' => $user->id, 'body' => 'Original']);

    $this->actingAs($user)
        ->patch(route('comments.update', $comment), ['body' => 'Edited'])
        ->assertRedirect();

    $this->assertDatabaseHas('comments', [
        'id' => $comment->id,
        'body' => 'Edited',
    ]);
});

test('non-author cannot update a comment', function () {
    $author = User::factory()->create();
    $otherMember = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $author->id]);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $author->id, 'role' => 'owner']);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $otherMember->id, 'role' => 'member']);
    $idea = Idea::factory()->shared($team)->create();
    $comment = Comment::factory()->create(['idea_id' => $idea->id, 'user_id' => $author->id, 'body' => 'Original']);

    $this->actingAs($otherMember)
        ->patch(route('comments.update', $comment), ['body' => 'Hijacked'])
        ->assertForbidden();

    $this->assertDatabaseHas('comments', ['id' => $comment->id, 'body' => 'Original']);
});

test('author can delete their own comment', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $user->id, 'role' => 'owner']);
    $idea = Idea::factory()->shared($team)->create();
    $comment = Comment::factory()->create(['idea_id' => $idea->id, 'user_id' => $user->id]);

    $this->actingAs($user)
        ->delete(route('comments.destroy', $comment))
        ->assertRedirect();

    $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
});

test('non-author cannot delete a comment', function () {
    $author = User::factory()->create();
    $otherMember = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $author->id]);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $author->id, 'role' => 'owner']);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $otherMember->id, 'role' => 'member']);
    $idea = Idea::factory()->shared($team)->create();
    $comment = Comment::factory()->create(['idea_id' => $idea->id, 'user_id' => $author->id]);

    $this->actingAs($otherMember)
        ->delete(route('comments.destroy', $comment))
        ->assertForbidden();

    $this->assertDatabaseHas('comments', ['id' => $comment->id]);
});

test('outsider cannot comment on a shared idea', function () {
    $owner = User::factory()->create();
    $outsider = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $owner->id, 'role' => 'owner']);
    $idea = Idea::factory()->shared($team)->create();

    $this->actingAs($outsider)
        ->post(route('comments.store', $idea), ['body' => 'Sneaky comment'])
        ->assertForbidden();

    $this->assertDatabaseMissing('comments', ['idea_id' => $idea->id, 'user_id' => $outsider->id]);
});

test('commenting is rate limited after 5 attempts per minute', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $user->id, 'role' => 'owner']);
    $idea = Idea::factory()->shared($team)->create();

    for ($i = 0; $i < 5; $i++) {
        $this->actingAs($user)->post(route('comments.store', $idea), ['body' => "Comment $i"]);
    }

    $this->actingAs($user)
        ->post(route('comments.store', $idea), ['body' => 'One too many'])
        ->assertStatus(429);
});

test('outsider cannot reply to a comment on a shared idea', function () {
    $owner = User::factory()->create();
    $outsider = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $owner->id, 'role' => 'owner']);
    $idea = Idea::factory()->shared($team)->create();
    $comment = Comment::factory()->create(['idea_id' => $idea->id, 'user_id' => $owner->id]);

    $this->actingAs($outsider)
        ->post(route('comments.reply', $comment), ['body' => 'Sneaky reply'])
        ->assertForbidden();

    $this->assertDatabaseMissing('comments', [
        'parent_id' => $comment->id,
        'user_id' => $outsider->id,
    ]);
});

test('non-owner cannot comment on a private idea', function () {
    $owner = User::factory()->create();
    $outsider = User::factory()->create();
    $idea = Idea::factory()->create(['user_id' => $owner->id]);

    $this->actingAs($outsider)
        ->post(route('comments.store', $idea), ['body' => 'Should be blocked'])
        ->assertForbidden();
});

test('posting a comment dispatches CommentPosted event', function () {
    Event::fake();

    $user = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $user->id, 'role' => 'owner']);
    $idea = Idea::factory()->shared($team)->create();

    $this->actingAs($user)
        ->post(route('comments.store', $idea), ['body' => 'Trigger the event']);

    Event::assertDispatched(CommentPosted::class, function ($event) use ($idea, $user) {
        return $event->comment->idea_id === $idea->id
            && $event->comment->user_id === $user->id;
    });
});

test('idea owner receives a database notification when someone comments', function () {
    $owner = User::factory()->create();
    $commenter = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $owner->id, 'role' => 'owner']);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $commenter->id, 'role' => 'member']);
    $idea = Idea::factory()->shared($team)->create(['user_id' => $owner->id]);

    $this->actingAs($commenter)
        ->post(route('comments.store', $idea), ['body' => 'Nice idea']);

    expect($owner->fresh()->notifications()->count())->toBe(1);
});

test('idea owner does not get notified when commenting on their own idea', function () {
    $owner = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $owner->id, 'role' => 'owner']);
    $idea = Idea::factory()->shared($team)->create(['user_id' => $owner->id]);

    $this->actingAs($owner)
        ->post(route('comments.store', $idea), ['body' => 'My own comment']);

    expect($owner->fresh()->notifications()->count())->toBe(0);
});
