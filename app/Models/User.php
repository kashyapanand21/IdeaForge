<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $avatar
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'password', 'avatar'])]
#[Hidden(['password', 'remember_token'])]
// MustVerifyEmail is a CONTRACT (interface) — it tells Laravel this user type
// requires email verification. The Registered event listener checks for this
// interface and automatically sends the verification email when fired.

// class User extends Authenticatable implements MustVerifyEmail
class User extends Authenticatable 
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // --- Teams ---

    public function ownedTeams(): HasMany
    {
        return $this->hasMany(Team::class, 'owner_id');
    }

    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'team_members')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function teamMemberships(): HasMany
    {
        return $this->hasMany(TeamMember::class);
    }

    // --- Ideas ---

    public function ideas(): HasMany
    {
        return $this->hasMany(Idea::class);
    }

    public function privateIdeas(): HasMany
    {
        return $this->hasMany(Idea::class)->whereNull('team_id');
    }

    public function sharedIdeas(): HasMany
    {
        return $this->hasMany(Idea::class)->whereNotNull('team_id');
    }

    // --- Votes ---

    public function ideaVotes(): HasMany
    {
        return $this->hasMany(IdeaVote::class);
    }

    // --- Comments ---

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    // --- Hackathons ---

    public function createdHackathons(): HasMany
    {
        return $this->hasMany(Hackathon::class, 'created_by');
    }

    public function assignedMilestones(): HasMany
    {
        return $this->hasMany(HackathonMilestone::class, 'assigned_to');
    }

    // --- Invites ---

    public function sentInvites(): HasMany
    {
        return $this->hasMany(TeamInvite::class, 'invited_by');
    }

    // --- Helpers ---

    public function isMemberOf(Team $team): bool
    {
        return $this->teams()->wherePivot('team_id', $team->id)->exists();
    }

    public function roleIn(Team $team): ?string
    {
        $membership = $this->teamMemberships()
            ->where('team_id', $team->id)
            ->first();

        return $membership?->role;
    }

    public function canManage(Team $team): bool
    {
        return in_array($this->roleIn($team), ['owner', 'admin']);
    }

    public function ownsTeam(Team $team): bool
    {
        return $team->owner_id === $this->id;
    }
}
