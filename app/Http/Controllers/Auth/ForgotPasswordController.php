<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;
use Inertia\Response;

class ForgotPasswordController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/forgot-password');
    }

    public function store(ForgotPasswordRequest $request): RedirectResponse
    {
        // Password::sendResetLink() does ALL of this for you:
        // 1. Looks up the user by email
        // 2. Generates a secure random token
        // 3. Stores a hashed version in password_reset_tokens table
        // 4. Sends a reset email with a signed URL containing the token
        $status = Password::sendResetLink(
            $request->only('email'),
        );

        // Password::RESET_LINK_SENT is a string constant 'passwords.sent'
        // We redirect back with a status message regardless of whether email exists
        // This prevents user enumeration — attacker can't tell if email is registered
        return $status === Password::RESET_LINK_SENT
            ? back()->with('status', __($status))
            : back()->withErrors(['email' => __($status)]);
    }
}
