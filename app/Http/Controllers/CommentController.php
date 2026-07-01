<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use App\Models\Comment;
use App\Models\Idea;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\RateLimiter;

class CommentController extends Controller
{
    public function store(StoreCommentRequest $request, Idea $idea): RedirectResponse
    {
        $this->authorize('create', [Comment::class, $idea]);

        $key = 'comment:'.$request->user()->id;

        if (RateLimiter::tooManyAttempts($key, 5)) {
            abort(429, 'Too many comments. Slow down.');
        }
        RateLimiter::hit($key, 60);

        Comment::create([
            'idea_id' => $idea->id,
            'user_id' => $request->user()->id,
            'body' => $request->validated('body'),
        ]);

        return back();
    }

    public function reply(StoreCommentRequest $request, Comment $comment): RedirectResponse
    {
        abort_if($comment->isReply(), 400, 'Cannot reply to a reply.');

        $this->authorize('create', [Comment::class, $comment->idea]);

        $key = 'comment:'.$request->user()->id;

        if (RateLimiter::tooManyAttempts($key, 5)) {
            abort(429, 'Too many comments. Slow down.');
        }
        RateLimiter::hit($key, 60);

        Comment::create([
            'idea_id' => $comment->idea_id,
            'user_id' => $request->user()->id,
            'parent_id' => $comment->id,
            'body' => $request->validated('body'),
        ]);

        return back();
    }

    public function update(UpdateCommentRequest $request, Comment $comment): RedirectResponse
    {
        $this->authorize('update', $comment);

        $comment->update(['body' => $request->validated('body')]);

        return back();
    }

    public function destroy(Comment $comment): RedirectResponse
    {
        $this->authorize('delete', $comment);

        $comment->delete();

        return back();
    }
}
