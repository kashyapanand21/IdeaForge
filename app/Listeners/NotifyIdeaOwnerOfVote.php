<?php

namespace App\Listeners;

use App\Events\IdeaVoted;
use App\Notifications\IdeaVotedNotification;

class NotifyIdeaOwnerOfVote
{
    public function handle(IdeaVoted $event): void
    {
        $idea = $event->vote->idea;

        if ($idea->user_id === $event->vote->user_id) {
            return;
        }

        $idea->user->notify(new IdeaVotedNotification($event->vote));
    }
}
