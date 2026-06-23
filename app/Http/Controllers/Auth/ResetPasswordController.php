<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ResetPasswordRequest;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ResetPasswordController extends Controller
{
    // The token comes from the URL — Laravel puts it in the route parameter
    public function create(string $token): Response
    {
        return Inertia::render('auth/reset-password', [
            'token' => $token,
            // Pre-fill the email from the query string (Laravel puts it there)
            'email' => request()->string('email'),
        ]);
    }

    public function store(ResetPasswordRequest $request): RedirectResponse
    {
        // Password::reset() does ALL of this:
        // 1. Finds the user by email
        // 2. Verifies the token matches what's in password_reset_tokens
        // 3. Calls your callback to actually update the password
        // 4. Deletes the used token so it can't be reused
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request): void {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    // Str::random() generates a new remember token
                    // this logs out all other devices that had remember-me cookies
                    'remember_token' => Str::random(60),
                ])->save();

                // PasswordReset event can be listened to for logging, notifications, etc.
                event(new PasswordReset($user));
            },
        );

        return $status === Password::PASSWORD_RESET
            ? redirect()->route('login')->with('status', __($status))
            : back()->withErrors(['email' => __($status)]);
    }
}
