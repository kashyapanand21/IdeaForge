<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/login');
    }

    // LoginRequest replaces the inline $request->validate([...])
    // Laravel resolves it from the container, runs authorize() + rules() first
    // If validation fails, it redirects back with errors automatically
    public function store(LoginRequest $request): RedirectResponse
    {
        // validated() returns only the fields that passed your rules — safe to use
        $credentials = $request->validated();

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()->withErrors([
                'email' => 'These credentials do not match our records.',
            ]);
        }

        // regenerate() prevents session fixation attacks
        // an attacker can't reuse a session ID they captured before login
        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();

        // invalidate() destroys the session data
        // regenerateToken() issues a new CSRF token so old forms can't be reused
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }
}
