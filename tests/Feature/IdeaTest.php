<?php

use App\Models\Idea;
use App\Models\Team;
use App\Models\TeamMember;
use App\Models\User;

// ── Index ─────────────────────────────────────────────────────────────────────

test('ideas index renders for authenticated user', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('ideas.index'))
        ->assertOk();
});

test('ideas index is split into private and shared', function () {
    $user  = User::factory()->create();
    $team  = Team::factory()->create(['owner_id' => $user->id]);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $user->id, 'role' => 'owner']);

    $privateIdea = Idea::factory()->create(['user_id' => $user->id]);
    $sharedIdea  = Idea::factory()->shared($team)->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('ideas.index'))
        ->assertInertia(fn ($page) => $page
            ->component('ideas/index')
            ->has('privateIdeas', 1)
            ->has('sharedIdeas', 1)
        );
});

// ── Create ────────────────────────────────────────────────────────────────────

test('create form renders for authenticated user', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('ideas.create'))
        ->assertOk();
});

test('guests cannot access create form', function () {
    $this->get(route('ideas.create'))
        ->assertRedirect(route('login'));
});

// ── Store ─────────────────────────────────────────────────────────────────────

test('user can create an idea', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('ideas.store'), [
            'title'        => 'My Test Idea',
            'problem'      => 'A real problem exists here.',
            'solution'     => 'Here is how we solve it.',
            'target_user'  => 'Developers who need this.',
            'biggest_risk' => 'Nobody wants it.',
        ])
        ->assertRedirect();

    // Verify the idea was saved to the database with correct owner
    $this->assertDatabaseHas('ideas', [
        'title'   => 'My Test Idea',
        'user_id' => $user->id,
        // private by default — team_id must be null
        'team_id' => null,
        'status'  => 'raw',
    ]);
});

test('store sets user_id from auth not from request', function () {
    $user      = User::factory()->create();
    $otherUser = User::factory()->create();

    $this->actingAs($user)
        ->post(route('ideas.store'), [
            // attacker tries to assign idea to another user
            'user_id'      => $otherUser->id,
            'title'        => 'Hijacked Idea',
            'problem'      => 'Some problem.',
            'solution'     => 'Some solution.',
            'target_user'  => 'Someone.',
            'biggest_risk' => 'Some risk.',
        ]);

    // idea must belong to the authenticated user, not the injected one
    $this->assertDatabaseHas('ideas', [
        'title'   => 'Hijacked Idea',
        'user_id' => $user->id,
    ]);
});

test('store requires all fields', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('ideas.store'), [])
        ->assertSessionHasErrors(['title', 'problem', 'solution', 'target_user', 'biggest_risk']);
});

test('store rejects invalid status', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('ideas.store'), [
            'title'        => 'My Idea',
            'problem'      => 'Problem.',
            'solution'     => 'Solution.',
            'target_user'  => 'Target.',
            'biggest_risk' => 'Risk.',
            'status'       => 'invalid_status',
        ])
        ->assertSessionHasErrors('status');
});

// ── Show ──────────────────────────────────────────────────────────────────────

test('owner can view their private idea', function () {
    $user = User::factory()->create();
    $idea = Idea::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('ideas.show', $idea))
        ->assertOk();
});

test('team member can view a shared idea', function () {
    $owner  = User::factory()->create();
    $member = User::factory()->create();
    $team   = Team::factory()->create(['owner_id' => $owner->id]);

    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $owner->id, 'role' => 'owner']);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $member->id, 'role' => 'member']);

    $idea = Idea::factory()->shared($team)->create(['user_id' => $owner->id]);

    $this->actingAs($member)
        ->get(route('ideas.show', $idea))
        ->assertOk();
});

test('outsider cannot view a private idea', function () {
    $owner    = User::factory()->create();
    $outsider = User::factory()->create();
    $idea     = Idea::factory()->create(['user_id' => $owner->id]);

    $this->actingAs($outsider)
        ->get(route('ideas.show', $idea))
        ->assertForbidden();
});

test('outsider cannot view a shared idea they are not a member of', function () {
    $owner    = User::factory()->create();
    $outsider = User::factory()->create();
    $team     = Team::factory()->create(['owner_id' => $owner->id]);

    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $owner->id, 'role' => 'owner']);

    $idea = Idea::factory()->shared($team)->create(['user_id' => $owner->id]);

    $this->actingAs($outsider)
        ->get(route('ideas.show', $idea))
        ->assertForbidden();
});

// ── Update ────────────────────────────────────────────────────────────────────

test('owner can update their idea', function () {
    $user = User::factory()->create();
    $idea = Idea::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->patch(route('ideas.update', $idea), [
            'title' => 'Updated Title',
        ])
        ->assertRedirect(route('ideas.show', $idea));

    $this->assertDatabaseHas('ideas', [
        'id'    => $idea->id,
        'title' => 'Updated Title',
    ]);
});

test('non-owner cannot update an idea', function () {
    $owner    = User::factory()->create();
    $outsider = User::factory()->create();
    $idea     = Idea::factory()->create(['user_id' => $owner->id]);

    $this->actingAs($outsider)
        ->patch(route('ideas.update', $idea), [
            'title' => 'Stolen Title',
        ])
        ->assertForbidden();
});

// ── Destroy ───────────────────────────────────────────────────────────────────

test('owner can delete their idea', function () {
    $user = User::factory()->create();
    $idea = Idea::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->delete(route('ideas.destroy', $idea))
        ->assertRedirect(route('ideas.index'));

    $this->assertDatabaseMissing('ideas', ['id' => $idea->id]);
});

test('non-owner cannot delete an idea', function () {
    $owner    = User::factory()->create();
    $outsider = User::factory()->create();
    $idea     = Idea::factory()->create(['user_id' => $owner->id]);

    $this->actingAs($outsider)
        ->delete(route('ideas.destroy', $idea))
        ->assertForbidden();
});

// ── Share ─────────────────────────────────────────────────────────────────────

test('owner can share idea to their team', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $user->id, 'role' => 'owner']);

    $idea = Idea::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->post(route('ideas.share', $idea), ['team_id' => $team->id])
        ->assertRedirect(route('ideas.show', $idea));

    $this->assertDatabaseHas('ideas', [
        'id'      => $idea->id,
        'team_id' => $team->id,
    ]);
});

test('owner cannot share idea to a team they do not belong to', function () {
    $user      = User::factory()->create();
    $otherTeam = Team::factory()->create();
    $idea      = Idea::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->post(route('ideas.share', $idea), ['team_id' => $otherTeam->id])
        ->assertSessionHasErrors('team_id');
});

test('non-owner cannot share an idea', function () {
    $owner    = User::factory()->create();
    $outsider = User::factory()->create();
    $team     = Team::factory()->create(['owner_id' => $owner->id]);
    $idea     = Idea::factory()->create(['user_id' => $owner->id]);

    $this->actingAs($outsider)
        ->post(route('ideas.share', $idea), ['team_id' => $team->id])
        ->assertForbidden();
});

// ── Change Status ─────────────────────────────────────────────────────────────

test('owner can change idea status', function () {
    $user = User::factory()->create();
    $idea = Idea::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->post(route('ideas.status', $idea), ['status' => 'in_discussion'])
        ->assertRedirect();

    $this->assertDatabaseHas('ideas', [
        'id'     => $idea->id,
        'status' => 'in_discussion',
    ]);
});

test('team admin can change status of shared idea', function () {
    $owner = User::factory()->create();
    $admin = User::factory()->create();
    $team  = Team::factory()->create(['owner_id' => $owner->id]);

    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $owner->id, 'role' => 'owner']);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $admin->id, 'role' => 'admin']);

    $idea = Idea::factory()->shared($team)->create(['user_id' => $owner->id]);

    $this->actingAs($admin)
        ->post(route('ideas.status', $idea), ['status' => 'validated'])
        ->assertRedirect();

    $this->assertDatabaseHas('ideas', ['id' => $idea->id, 'status' => 'validated']);
});

test('regular member cannot change status of shared idea', function () {
    $owner  = User::factory()->create();
    $member = User::factory()->create();
    $team   = Team::factory()->create(['owner_id' => $owner->id]);

    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $owner->id, 'role' => 'owner']);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $member->id, 'role' => 'member']);

    $idea = Idea::factory()->shared($team)->create(['user_id' => $owner->id]);

    $this->actingAs($member)
        ->post(route('ideas.status', $idea), ['status' => 'validated'])
        ->assertForbidden();
});

// ── Pin ───────────────────────────────────────────────────────────────────────

test('owner can pin a shared idea', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $user->id, 'role' => 'owner']);

    $idea = Idea::factory()->shared($team)->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->post(route('ideas.pin', $idea))
        ->assertRedirect();

    $this->assertDatabaseHas('ideas', ['id' => $idea->id, 'is_pinned' => true]);
});

test('cannot pin a private idea', function () {
    $user = User::factory()->create();
    $idea = Idea::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->post(route('ideas.pin', $idea))
        ->assertForbidden();
});

test('regular member cannot pin an idea', function () {
    $owner  = User::factory()->create();
    $member = User::factory()->create();
    $team   = Team::factory()->create(['owner_id' => $owner->id]);

    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $owner->id, 'role' => 'owner']);
    TeamMember::factory()->create(['team_id' => $team->id, 'user_id' => $member->id, 'role' => 'member']);

    $idea = Idea::factory()->shared($team)->create(['user_id' => $owner->id]);

    $this->actingAs($member)
        ->post(route('ideas.pin', $idea))
        ->assertForbidden();
});