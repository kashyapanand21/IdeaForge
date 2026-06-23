<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    public function store(RegisterRequest $request): RedirectResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            // Hash::make() bcrypt-hashes the password
            // but since User casts password => 'hashed', you could also just pass plain text
            // Hash::make() here is explicit and clearer — either works
            'password' => Hash::make($request->password),
        ]);

        // Firing the Registered event does two things:
        // 1. If User implements MustVerifyEmail — sends the verification email
        // 2. Other listeners can hook into this event (e.g. welcome email, analytics)
        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('dashboard');
    }
}
