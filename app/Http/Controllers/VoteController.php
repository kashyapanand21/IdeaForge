<?php

namespace App\Http\Controllers;

use App\Http\Requests\VoteRequest;
use App\Models\Idea;
use App\Models\IdeaVote;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\RateLimiter;

class VoteController extends Controller
{
    public function store(VoteRequest $request, Idea $idea): RedirectResponse
    {
        $this->authorize('vote', $idea);

        $key = 'vote:'.$request->user()->id;

        if (RateLimiter::tooManyAttempts($key, 10)) {
            abort(429, 'Too many votes. Slow down.');
        }
        RateLimiter::hit($key, 60);

        $existingVote = IdeaVote::where('user_id', $request->user()->id)
            ->where('idea_id', $idea->id)
            ->first();

        if (! $existingVote) {
            IdeaVote::create([
                'user_id' => $request->user()->id,
                'idea_id' => $idea->id,
                'vote' => $request->validated('vote'),
            ]);

            return back();
        }

        if ($existingVote->vote === $request->validated('vote')) {
            $existingVote->delete(); // toggle off

            return back();
        }

        $existingVote->update(['vote' => $request->validated('vote')]);

        return back();
    }
}
