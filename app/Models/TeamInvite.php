<?php

namespace App\Models;

use Database\Factories\TeamInviteFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $team_id
 * @property int $invited_by
 * @property string $email
 * @property string $role
 * @property string $token
 * @property string $status
 * @property Carbon|null $expires_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['team_id', 'invited_by', 'email', 'role', 'token', 'status', 'expires_at'])]
class TeamInvite extends Model
{
    /** @use HasFactory<TeamInviteFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            // tells Laravel to treat expires_at as a Carbon date object
            // so you can do $invite->expires_at->isPast() instead of manually parsing
            'expires_at' => 'datetime',
        ];
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function invitedBy(): BelongsTo
    {
        // The user who sent this invite
        // second argument is the foreign key column name on this table
        return $this->belongsTo(User::class, 'invited_by');
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isAccepted(): bool
    {
        return $this->status === 'accepted';
    }

    public function isExpired(): bool
    {
        // Carbon makes date comparison this clean
        // expires_at is cast to Carbon so ->isPast() just works
        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    public function isValid(): bool
    {
        // An invite is only usable if it's still pending AND not expired
        return $this->isPending() && ! $this->isExpired();
    }
}