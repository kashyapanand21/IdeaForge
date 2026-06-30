<?php

namespace App\Http\Controllers;

use App\Http\Requests\Idea\CreateIdeaRequest;
use App\Http\Requests\Idea\UpdateIdeaRequest;
use App\Models\Idea;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IdeaController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        // privateIdeas() and sharedIdeas() are scopes already on the User model
        // They filter by team_id being null or not null respectively
        $privateIdeas = $user->privateIdeas()->latest()->get();

        $sharedIdeas = $user->sharedIdeas()->with('team')->latest()->get();

        return Inertia::render('ideas/index', [
            'privateIdeas' => $privateIdeas,
            'sharedIdeas'  => $sharedIdeas,
        ]);
    }

    public function create(): Response
    {
        // Pass the user's teams so the form can optionally share on create
        $teams = auth()->user()->teams()->get();

        return Inertia::render('ideas/create', [
            'teams' => $teams,
        ]);
    }

    public function store(CreateIdeaRequest $request): RedirectResponse
    {
        $idea = Idea::create([
            // user_id comes from auth, never from the request
            'user_id'      => auth()->id(),
            'title'        => $request->title,
            'problem'      => $request->problem,
            'solution'     => $request->solution,
            'target_user'  => $request->target_user,
            'biggest_risk' => $request->biggest_risk,
            // default to raw if status not sent
            'status'       => $request->input('status', 'raw'),
        ]);

        return redirect()->route('ideas.show', $idea)
            ->with('status', 'Idea created.');
    }

    public function show(Idea $idea): Response
    {
        // authorize() calls IdeaPolicy::view()
        // if it fails, Laravel returns 403 automatically
        $this->authorize('view', $idea);

        // Load relationships needed by the frontend
        $idea->load(['user', 'team', 'votes', 'comments.user']);

        return Inertia::render('ideas/show', [
            'idea' => $idea,
        ]);
    }

    public function edit(Idea $idea): Response
    {
        $this->authorize('update', $idea);

        $teams = auth()->user()->teams()->get();

        return Inertia::render('ideas/edit', [
            'idea'  => $idea,
            'teams' => $teams,
        ]);
    }

    public function update(UpdateIdeaRequest $request, Idea $idea): RedirectResponse
    {
        // authorize() is already handled in UpdateIdeaRequest::authorize()
        // but we also call it here explicitly so the Policy is the single
        // source of truth — FormRequest check was just an early gate
        $this->authorize('update', $idea);

        $idea->update($request->validated());

        return redirect()->route('ideas.show', $idea)
            ->with('status', 'Idea updated.');
    }

    public function destroy(Idea $idea): RedirectResponse
    {
        $this->authorize('delete', $idea);

        $idea->delete();

        return redirect()->route('ideas.index')
            ->with('status', 'Idea deleted.');
    }

    public function share(Request $request, Idea $idea): RedirectResponse
    {
        $this->authorize('share', $idea);

        $request->validate([
            'team_id' => ['required', 'integer', 'exists:teams,id'],
        ]);

        // Verify the user actually belongs to the team they're sharing to
        $team = Team::findOrFail($request->team_id);

        if (! auth()->user()->isMemberOf($team)) {
            return back()->withErrors(['team_id' => 'You are not a member of this team.']);
        }

        $idea->update([
            'team_id'   => $team->id,
            // shared_at records when the idea was first shared
            // the Observer we build later will handle this automatically
            // for now we set it manually
            'shared_at' => now(),
        ]);

        return redirect()->route('ideas.show', $idea)
            ->with('status', 'Idea shared to team.');
    }

    public function changeStatus(Request $request, Idea $idea): RedirectResponse
    {
        $this->authorize('changeStatus', $idea);

        $request->validate([
            'status' => ['required', 'in:raw,in_discussion,validated,shelved'],
        ]);

        $idea->update(['status' => $request->status]);

        return back()->with('status', 'Status updated.');
    }

    public function pin(Idea $idea): RedirectResponse
    {
        $this->authorize('pin', $idea);

        // Toggle — if pinned, unpin. If not pinned, pin.
        $idea->update(['is_pinned' => ! $idea->is_pinned]);

        return back()->with('status', $idea->is_pinned ? 'Idea pinned.' : 'Idea unpinned.');
    }
}