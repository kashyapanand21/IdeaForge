<?php

namespace App\Http\Controllers;

use App\Http\Requests\Team\InviteMemberRequest;
use App\Models\Team;
use App\Models\TeamInvite;
use App\Models\TeamMember;
use App\Models\User;
use App\Notifications\TeamInviteNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TeamInviteController extends Controller
{
    public function store(InviteMemberRequest $request, Team $team): RedirectResponse
    {
        $existing = TeamInvite::where('team_id', $team->id)
            ->where('email', $request->email)
            ->where('status', 'pending')
            ->exists();

        if ($existing) {
            return back()->withErrors(['email' => 'A pending invite already exists for this email.']);
        }

        $alreadyMember = $team->members()->where('email', $request->email)->exists();

        if ($alreadyMember) {
            return back()->withErrors(['email' => 'This person is already a team member.']);
        }

        $invite = TeamInvite::create([
            'team_id'    => $team->id,
            'invited_by' => auth()->id(),
            'email'      => $request->email,
            'role'       => $request->role,
            'token'      => Str::random(32),
            'status'     => 'pending',
            'expires_at' => now()->addHours(48),
        ]);

        \Illuminate\Support\Facades\Notification::route('mail', $invite->email)
            ->notify(new TeamInviteNotification($invite));

        return back()->with('status', 'Invite sent.');
    }

    public function accept(Request $request, string $token): RedirectResponse
    {
        $invite = TeamInvite::where('token', $token)->firstOrFail();

        if (! $invite->isValid()) {
            return redirect()->route('dashboard')
                ->withErrors(['invite' => 'This invite is expired or has already been used.']);
        }

        DB::transaction(function () use ($invite, $request): void {
            TeamMember::create([
                'team_id' => $invite->team_id,
                'user_id' => $request->user()->id,
                'role'    => $invite->role,
            ]);

            $invite->update(['status' => 'accepted']);
        });

        return redirect()->route('teams.show', $invite->team_id)
            ->with('status', 'You have joined the team.');
    }

    public function decline(string $token): RedirectResponse
    {
        $invite = TeamInvite::where('token', $token)->firstOrFail();

        if ($invite->isPending()) {
            $invite->update(['status' => 'declined']);
        }

        return redirect()->route('dashboard')
            ->with('status', 'Invite declined.');
    }

    public function destroy(Request $request, Team $team, TeamInvite $invite): RedirectResponse
    {
        $this->authorize('invite', $team);

        $invite->delete();

        return back()->with('status', 'Invite revoked.');
    }

    public function confirm(string $token): Response|RedirectResponse
    {
        $invite = TeamInvite::where('token', $token)->firstOrFail();

        if (! $invite->isValid()) {
            return redirect()->route('dashboard')
                ->withErrors(['invite' => 'This invite is expired or has already been used.']);
        }

        return Inertia::render('invites/confirm', [
            'invite' => $invite->load('team'),
            'token'  => $token,
        ]);
    }

    public function declinePage(string $token): Response|RedirectResponse
    {
        $invite = TeamInvite::where('token', $token)->firstOrFail();

        if (! $invite->isValid()) {
            return redirect()->route('dashboard')
                ->withErrors(['invite' => 'This invite is expired or has already been used.']);
        }

        return Inertia::render('invites/decline', [
            'invite' => $invite->load('team'),
            'token'  => $token,
        ]);
    }
}