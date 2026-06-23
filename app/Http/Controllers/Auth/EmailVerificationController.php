<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationController extends Controller
{
    // Shows the "please verify your email" notice page
    public function notice(): Response
    {
        return Inertia::render('auth/verify-email');
    }

    // EmailVerificationRequest is a special Laravel Form Request
    // It automatically validates that the signed URL is genuine
    // and that the 'id' in the URL matches the logged-in user
    public function verify(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard'));
        }

        // fulfill() marks email_verified_at and fires the Verified event
        $request->fulfill();

        return redirect()->intended(route('dashboard'));
    }

    // Resend the verification email
    public function resend(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard'));
        }

        $request->user()->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }
}
