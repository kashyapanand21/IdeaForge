<?php

namespace App\Notifications;

use App\Models\IdeaVote;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class IdeaVotedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly IdeaVote $vote) {}

    /** @return list<string> */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        return [
            'idea_id' => $this->vote->idea_id,
            'voter_id' => $this->vote->user_id,
            'vote' => $this->vote->vote,
        ];
    }
}
