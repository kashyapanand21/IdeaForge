<?php

use App\Http\Controllers\Auth\EmailVerificationController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ResetPasswordController;
use Illuminate\Support\Facades\Route;

// Public
Route::inertia('/', 'welcome')->name('home');

// Guest-only routes — logged-in users are redirected away by the 'guest' middleware
Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store']);

    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);

    Route::get('/forgot-password', [ForgotPasswordController::class, 'create'])->name('password.request');
    Route::post('/forgot-password', [ForgotPasswordController::class, 'store'])->name('password.email');

    // {token} is the reset token from the email link
    Route::get('/reset-password/{token}', [ResetPasswordController::class, 'create'])->name('password.reset');
    Route::post('/reset-password', [ResetPasswordController::class, 'store'])->name('password.update');
});

// Auth-only routes
Route::middleware('auth')->group(function () {

    // Email verification
    // 'verified' middleware (used on protected routes below) redirects here if unverified
    Route::get('/email/verify', [EmailVerificationController::class, 'notice'])->name('verification.notice');

    // This route uses a SIGNED URL — Laravel verifies the URL hasn't been tampered with
    // The 'signed' middleware rejects requests where the signature is invalid/expired
    Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
        ->middleware('signed')
        ->name('verification.verify');

    Route::post('/email/verification-notification', [EmailVerificationController::class, 'resend'])
        ->middleware('throttle:6,1')  // max 6 resends per minute
        ->name('verification.send');

    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    // App routes — also require verified email
    // Add 'verified' back once you add MustVerifyEmail to User model
    Route::inertia('/dashboard', 'dashboard')->name('dashboard');

    Route::inertia('/ideas', 'ideas/show')->name('ideas.index');
    Route::post('/ideas', fn () => redirect('/ideas'))->name('ideas.store');
    Route::inertia('/ideas/create', 'ideas/create')->name('ideas.create');
    Route::inertia('/ideas/1', 'ideas/show')->name('ideas.show');

    Route::inertia('/teams', 'teams/show')->name('teams.index');
    Route::inertia('/teams/1', 'teams/show')->name('teams.show');
    Route::inertia('/teams/1/settings', 'teams/settings')->name('teams.settings');

    Route::inertia('/hackathons', 'hackathons/index')->name('hackathons.index');
    Route::inertia('/hackathons/1', 'hackathons/show')->name('hackathons.show');

    Route::inertia('/notifications', 'notifications/index')->name('notifications.index');

    Route::inertia('/profile', 'profile/index')->name('profile.index');
    Route::patch('/profile', fn () => redirect('/profile'))->name('profile.update');
});
