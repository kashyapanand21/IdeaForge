<?php

use App\Http\Controllers\Auth\EmailVerificationController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\IdeaController;
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

    Route::get('/email/verify', [EmailVerificationController::class, 'notice'])->name('verification.notice');
    Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
        ->middleware('signed')
        ->name('verification.verify');
    Route::post('/email/verification-notification', [EmailVerificationController::class, 'resend'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    Route::get('/invites/{token}', [TeamInviteController::class, 'confirm'])
        ->name('invites.confirm');
    Route::get('/invites/{token}/decline', [TeamInviteController::class, 'declinePage'])
        ->name('invites.decline-page');

    // App routes — require verified email
    Route::middleware('verified')->group(function () {
        Route::inertia('/dashboard', 'dashboard')->name('dashboard');

        // Ideas — real resource routes replacing the old stubs
        Route::resource('ideas', IdeaController::class);
        Route::post('/ideas/{idea}/share', [IdeaController::class, 'share'])
            ->name('ideas.share');
        Route::post('/ideas/{idea}/status', [IdeaController::class, 'changeStatus'])
            ->name('ideas.status');
        Route::post('/ideas/{idea}/pin', [IdeaController::class, 'pin'])
            ->name('ideas.pin');

        Route::inertia('/hackathons', 'hackathons/index')->name('hackathons.index');
        Route::inertia('/hackathons/1', 'hackathons/show')->name('hackathons.show');

        Route::inertia('/notifications', 'notifications/index')->name('notifications.index');

        Route::inertia('/profile', 'profile/index')->name('profile.index');
        Route::patch('/profile', fn () => redirect('/profile'))->name('profile.update');

        // Teams
        Route::resource('teams', TeamController::class);
        Route::post('/teams/{team}/transfer-ownership', [TeamController::class, 'transferOwnership'])
            ->name('teams.transfer-ownership');

        Route::post('/teams/{team}/invites', [TeamInviteController::class, 'store'])
            ->name('teams.invites.store');
        Route::delete('/teams/{team}/invites/{invite}', [TeamInviteController::class, 'destroy'])
            ->name('teams.invites.destroy');

        Route::post('/invites/{token}/accept', [TeamInviteController::class, 'accept'])
            ->name('invites.accept');
        Route::post('/invites/{token}/decline', [TeamInviteController::class, 'decline'])
            ->name('invites.decline');

        Route::delete('/teams/{team}/members/{user}', [TeamMemberController::class, 'destroy'])
            ->name('teams.members.destroy');
        Route::delete('/teams/{team}/leave', [TeamMemberController::class, 'leave'])
            ->name('teams.leave');
    });
});
