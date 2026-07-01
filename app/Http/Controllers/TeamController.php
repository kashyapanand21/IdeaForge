<?php

namespace App\Http\Controllers;

use App\Http\Requests\Team\CreateTeamRequest;
use App\Http\Requests\Team\TransferOwnershipRequest;
use App\Http\Requests\Team\UpdateTeamRequest;
use App\Models\Team;
use App\Models\TeamMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    public function index(): Response
    {
        $teams = auth()->user()->teams()->with('owner')->get();

        return Inertia::render('teams/index', [
            'teams' => $teams,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('teams/create');
    }

    public function store(CreateTeamRequest $request): RedirectResponse
    {
        // DB::transaction ensures both inserts happen or neither does
        $team = DB::transaction(function () use ($request): Team {
            $team = Team::create([
                'owner_id' => auth()->id(),
                'name' => $request->name,
                'description' => $request->description,
            ]);

            // Owner is also a member — add them to team_members with owner role
            TeamMember::create([
                'team_id' => $team->id,
                'user_id' => auth()->id(),
                'role' => 'owner',
            ]);

            return $team;
        });

        return redirect()->route('teams.show', $team);
    }

    public function show(Team $team): Response
    {
        $this->authorize('view', $team);

        $team->load(['members', 'ideas' => function ($query) {
            $query->withCount('comments')->orderByDesc('is_pinned');
        }]);

        return Inertia::render('teams/show', [
            'team' => $team,
        ]);
    }

    public function edit(Team $team): Response
    {
        $this->authorize('update', $team);

        return Inertia::render('teams/settings', [
            'team' => $team->load('members'),
            'invites' => $team->invites()->where('status', 'pending')->get(),
        ]);
    }

    public function update(UpdateTeamRequest $request, Team $team): RedirectResponse
    {
        $team->update($request->validated());

        return back()->with('status', 'Team updated.');
    }

    public function destroy(Team $team): RedirectResponse
    {
        $this->authorize('delete', $team);

        $team->delete();

        return redirect()->route('teams.index');
    }

    public function transferOwnership(TransferOwnershipRequest $request, Team $team): RedirectResponse
    {
        $newOwnerId = $request->user_id;

        DB::transaction(function () use ($team, $newOwnerId): void {
            // Demote current owner to admin
            TeamMember::where('team_id', $team->id)
                ->where('user_id', $team->owner_id)
                ->update(['role' => 'admin']);

            // Promote new owner
            TeamMember::where('team_id', $team->id)
                ->where('user_id', $newOwnerId)
                ->update(['role' => 'owner']);

            // Update the team's owner_id
            $team->update(['owner_id' => $newOwnerId]);
        });

        return back()->with('status', 'Ownership transferred.');
    }
}
