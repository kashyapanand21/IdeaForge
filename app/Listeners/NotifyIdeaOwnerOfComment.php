<?php

namespace App\Listeners;

use App\Events\CommentPosted;
use App\Notifications\CommentPostedNotification;

class NotifyIdeaOwnerOfComment
{
    public function handle(CommentPosted $event): void
    {
        $idea = $event->comment->idea;

        if ($idea->user_id === $event->comment->user_id) {
            return; // don't notify yourself
        }

        $idea->user->notify(new CommentPostedNotification($event->comment));
    }
}
