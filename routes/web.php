<?php

use App\Http\Controllers\Auth\EmailVerificationController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TeamInviteController;
use App\Http\Controllers\TeamMemberController;
use Illuminate\Support\Facades\Route;

// Public
Route::inertia('/', 'welcome')->name('home');

// Guest-only
Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store']);

    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);

    Route::get('/forgot-password', [ForgotPasswordController::class, 'create'])->name('password.request');
    Route::post('/forgot-password', [ForgotPasswordController::class, 'store'])->name('password.email');

    Route::get('/reset-password/{token}', [ResetPasswordController::class, 'create'])->name('password.reset');
    Route::post('/reset-password', [ResetPasswordController::class, 'store'])->name('password.update');
});

// Auth-only
Route::middleware('auth')->group(function () {

    // Email verification — auth but NOT verified (user needs to reach these to verify)
    Route::get('/email/verify', [EmailVerificationController::class, 'notice'])->name('verification.notice');
    Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
        ->middleware('signed')
        ->name('verification.verify');
    Route::post('/email/verification-notification', [EmailVerificationController::class, 'resend'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    // Invite confirmation pages — auth but not verified
    // (invited person may not have verified email yet)
    Route::get('/invites/{token}', [TeamInviteController::class, 'confirm'])
        ->name('invites.confirm');
    Route::get('/invites/{token}/decline', [TeamInviteController::class, 'declinePage'])
        ->name('invites.decline-page');

    // App routes — require verified email
    Route::middleware('verified')->group(function () {
        Route::inertia('/dashboard', 'dashboard')->name('dashboard');

        Route::inertia('/ideas', 'ideas/show')->name('ideas.index');
        Route::post('/ideas', fn () => redirect('/ideas'))->name('ideas.store');
        Route::inertia('/ideas/create', 'ideas/create')->name('ideas.create');
        Route::inertia('/ideas/1', 'ideas/show')->name('ideas.show');

        Route::inertia('/hackathons', 'hackathons/index')->name('hackathons.index');
        Route::inertia('/hackathons/1', 'hackathons/show')->name('hackathons.show');

        Route::inertia('/notifications', 'notifications/index')->name('notifications.index');

        Route::inertia('/profile', 'profile/index')->name('profile.index');
        Route::patch('/profile', fn () => redirect('/profile'))->name('profile.update');

        // Teams
        Route::resource('teams', TeamController::class);
        Route::post('/teams/{team}/transfer-ownership', [TeamController::class, 'transferOwnership'])
            ->name('teams.transfer-ownership');

        // Invites — sent by team admins/owners
        Route::post('/teams/{team}/invites', [TeamInviteController::class, 'store'])
            ->name('teams.invites.store');
        Route::delete('/teams/{team}/invites/{invite}', [TeamInviteController::class, 'destroy'])
            ->name('teams.invites.destroy');

        // Invite responses — POST because they change state
        Route::post('/invites/{token}/accept', [TeamInviteController::class, 'accept'])
            ->name('invites.accept');
        Route::post('/invites/{token}/decline', [TeamInviteController::class, 'decline'])
            ->name('invites.decline');

        // Member management
        Route::delete('/teams/{team}/members/{user}', [TeamMemberController::class, 'destroy'])
            ->name('teams.members.destroy');
        Route::delete('/teams/{team}/leave', [TeamMemberController::class, 'leave'])
            ->name('teams.leave');
    });
});