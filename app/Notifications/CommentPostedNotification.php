<?php

namespace App\Notifications;

use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class CommentPostedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly Comment $comment) {}

    /** @return list<string> */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        return [
            'idea_id' => $this->comment->idea_id,
            'comment_id' => $this->comment->id,
            'commenter_id' => $this->comment->user_id,
            'is_reply' => $this->comment->isReply(),
        ];
    }
}
