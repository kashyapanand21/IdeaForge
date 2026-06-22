<?php

use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::inertia('/dashboard', 'dashboard')->name('dashboard');

    Route::inertia('/ideas', 'ideas/show')->name('ideas.index');
    Route::post('/ideas', fn() => redirect('/ideas'))->name('ideas.store');
    Route::inertia('/ideas/create', 'ideas/create')->name('ideas.create');
    Route::inertia('/ideas/1', 'ideas/show')->name('ideas.show');

    Route::inertia('/teams', 'teams/show')->name('teams.index');
    Route::inertia('/teams/1', 'teams/show')->name('teams.show');
    Route::inertia('/teams/1/settings', 'teams/settings')->name('teams.settings');

    Route::inertia('/hackathons', 'hackathons/index')->name('hackathons.index');
    Route::inertia('/hackathons/1', 'hackathons/show')->name('hackathons.show');

    Route::inertia('/notifications', 'notifications/index')->name('notifications.index');

    Route::inertia('/profile', 'profile/index')->name('profile.index');
    Route::patch('/profile', fn() => redirect('/profile'))->name('profile.update');
});