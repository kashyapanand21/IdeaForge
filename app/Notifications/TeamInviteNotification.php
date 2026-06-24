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
        // Links to a confirmation page — the page then POSTs to invites.accept
        // Direct links to state-changing endpoints are a CSRF/CSRF-by-navigation risk
        $confirmUrl = route('invites.confirm', $this->invite->token);
        $declineUrl = route('invites.decline-page', $this->invite->token);

        return (new MailMessage)
            ->subject("You've been invited to join {$this->invite->team->name} on IdeaForge")
            ->greeting('Hello!')
            ->line("You've been invited to join **{$this->invite->team->name}** as a {$this->invite->role}.")
            ->action('View Invite', $confirmUrl)
            ->line("Or decline: {$declineUrl}")
            ->line('This invite expires in 48 hours.');
    }
}