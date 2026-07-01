<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class TeamMemberController extends Controller
{
    public function destroy(Request $request, Team $team, User $user): RedirectResponse
    {
        $this->authorize('removeMember', $team);

        if ($team->owner_id === $user->id) {
            return back()->withErrors(['member' => 'The team owner cannot be removed.']);
        }

        // Find the specific membership row then delete it
        // This is clearer to both PHP and Intelephense than chaining where()->delete()
        $membership = TeamMember::where('team_id', $team->id)
            ->where('user_id', $user->id)
            ->first();

        if ($membership) {
            $membership->delete();
        }

        return back()->with('status', 'Member removed.');
    }

    public function leave(Request $request, Team $team): RedirectResponse
    {
        $this->authorize('leave', $team);

        $membership = TeamMember::where('team_id', $team->id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($membership) {
            $membership->delete();
        }

        return redirect()->route('teams.index')
            ->with('status', 'You have left the team.');
    }
}
