<?php

namespace App\Listeners;

use App\Events\CommentPosted;
use Illuminate\Support\Facades\Log;

class LogCommentActivity
{
    public function handle(CommentPosted $event): void
    {
        Log::info('Comment posted', [
            'comment_id' => $event->comment->id,
            'idea_id' => $event->comment->idea_id,
            'user_id' => $event->comment->user_id,
            'is_reply' => $event->comment->isReply(),
        ]);
    }
}
