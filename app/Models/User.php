<?php

namespace App\Models;

use Database\Factories\UserFactory;
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

    /** @return HasMany<Team, User> */
    public function ownedTeams(): HasMany
    {
        return $this->hasMany(Team::class, 'owner_id');
    }

    /** @return BelongsToMany<Team, User> */
    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'team_members')
            ->withPivot('role')
            ->withTimestamps();
    }

    /** @return HasMany<TeamMember, User> */
    public function teamMemberships(): HasMany
    {
        return $this->hasMany(TeamMember::class);
    }

    // --- Ideas ---

    /** @return HasMany<Idea, User> */
    public function ideas(): HasMany
    {
        return $this->hasMany(Idea::class);
    }

    /** @return HasMany<Idea, User> */
    public function privateIdeas(): HasMany
    {
        return $this->hasMany(Idea::class)->whereNull('team_id');
    }

    /** @return HasMany<Idea, User> */
    public function sharedIdeas(): HasMany
    {
        return $this->hasMany(Idea::class)->whereNotNull('team_id');
    }

    // --- Votes ---

    /** @return HasMany<IdeaVote, User> */
    public function ideaVotes(): HasMany
    {
        return $this->hasMany(IdeaVote::class);
    }

    // --- Comments ---

    /** @return HasMany<Comment, User> */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    // --- Hackathons ---

    /** @return HasMany<Hackathon, User> */
    public function createdHackathons(): HasMany
    {
        return $this->hasMany(Hackathon::class, 'created_by');
    }

    /** @return HasMany<HackathonMilestone, User> */
    public function assignedMilestones(): HasMany
    {
        return $this->hasMany(HackathonMilestone::class, 'assigned_to');
    }

    // --- Invites ---

    /** @return HasMany<TeamInvite, User> */
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
        /** @var TeamMember|null $membership */
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
