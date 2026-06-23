<?php

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Testing\TestCase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Password;

// ── Registration ──────────────────────────────────────────────────────────────

test('registration page renders', function () {
    /** @var TestCase $this */
    $this->get(route('register'))->assertOk();
});

test('user can register', function () {
    /** @var TestCase $this */
    Event::fake();

    $this->post('/register', [
        'name' => 'Anand Kashyap',
        'email' => 'anand@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertRedirect(route('dashboard'));

    $this->assertDatabaseHas('users', ['email' => 'anand@example.com']);
    Event::assertDispatched(Registered::class);
});

test('registration requires all fields', function () {
    /** @var TestCase $this */
    $this->post('/register', [])->assertSessionHasErrors(['name', 'email', 'password']);
});

test('registration rejects duplicate email', function () {
    /** @var TestCase $this */
    User::factory()->create(['email' => 'taken@example.com']);

    $this->post('/register', [
        'name' => 'Someone',
        'email' => 'taken@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertSessionHasErrors('email');
});

// ── Login ─────────────────────────────────────────────────────────────────────

test('login page renders', function () {
    /** @var TestCase $this */
    $this->get(route('login'))->assertOk();
});

test('user can login with correct credentials', function () {
    /** @var TestCase $this */
    /** @var User $user */
    $user = User::factory()->create();

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ])->assertRedirect(route('dashboard'));

    $this->assertAuthenticatedAs($user);
});

test('login fails with wrong password', function () {
    /** @var TestCase $this */
    /** @var User $user */
    $user = User::factory()->create();

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ])->assertSessionHasErrors('email');
});

// ── Logout ────────────────────────────────────────────────────────────────────

test('authenticated user can logout', function () {
    /** @var TestCase $this */
    /** @var User $user */
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('logout'))
        ->assertRedirect(route('home'));

    $this->assertGuest();
});

// ── Guest middleware ──────────────────────────────────────────────────────────

test('authenticated user is redirected away from login page', function () {
    /** @var TestCase $this */
    /** @var User $user */
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('login'))
        ->assertRedirect();
});

// ── Auth middleware ───────────────────────────────────────────────────────────

test('unauthenticated user cannot access dashboard', function () {
    /** @var TestCase $this */
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

// ── Password reset ────────────────────────────────────────────────────────────

test('forgot password page renders', function () {
    /** @var TestCase $this */
    $this->get(route('password.request'))->assertOk();
});

test('reset link can be requested for existing email', function () {
    /** @var TestCase $this */
    /** @var User $user */
    $user = User::factory()->create();

    $this->post(route('password.email'), ['email' => $user->email])
        ->assertSessionHas('status');
});

test('reset link request does not reveal if email exists', function () {
    /** @var TestCase $this */
    $this->post(route('password.email'), ['email' => 'ghost@example.com'])
        ->assertRedirect();
});

test('password can be reset with valid token', function () {
    /** @var TestCase $this */
    /** @var User $user */
    $user = User::factory()->create();
    $token = Password::createToken($user);

    $this->post(route('password.update'), [
        'token' => $token,
        'email' => $user->email,
        'password' => 'newpassword123',
        'password_confirmation' => 'newpassword123',
    ])->assertRedirect(route('login'));
});
