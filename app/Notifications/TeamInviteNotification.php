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
        $acceptUrl = route('invites.accept', $this->invite->token);
        $declineUrl = route('invites.decline', $this->invite->token);

        return (new MailMessage)
            ->subject("You've been invited to join {$this->invite->team->name} on IdeaForge")
            ->greeting("Hello!")
            ->line("You've been invited to join **{$this->invite->team->name}** as a {$this->invite->role}.")
            ->action('Accept Invite', $acceptUrl)
            ->line("Or decline: {$declineUrl}")
            ->line('This invite expires in 48 hours.');
    }
}