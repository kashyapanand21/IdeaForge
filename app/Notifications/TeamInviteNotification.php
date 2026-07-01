<?php

namespace App\Notifications;

use App\Models\TeamInvite;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TeamInviteNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly TeamInvite $invite) {}

    /** @return list<string> */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $team = $this->invite->team;
        assert($team !== null);

        $confirmUrl = route('invites.confirm', $this->invite->token);
        $declineUrl = route('invites.decline-page', $this->invite->token);

        return (new MailMessage)
            ->subject("You've been invited to join {$team->name} on IdeaForge")
            ->greeting('Hello!')
            ->line("You've been invited to join **{$team->name}** as a {$this->invite->role}.")
            ->action('View Invite', $confirmUrl)
            ->line("Or decline: {$declineUrl}")
            ->line('This invite expires in 48 hours.');
    }
}
