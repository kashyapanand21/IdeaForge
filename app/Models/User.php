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
            'password'          => 'hashed',
        ];
    }

    // --- Teams ---

    public function ownedTeams(): HasMany
    {
        // teams where this user is the owner
        return $this->hasMany(Team::class, 'owner_id');
    }

    public function teams(): BelongsToMany
    {
        // all teams this user is a member of (including ones they own)
        // through the team_members pivot table
        return $this->belongsToMany(Team::class, 'team_members')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function teamMemberships(): HasMany
    {
        // direct access to TeamMember rows for this user
        // useful when you need the role without going through the pivot
        return $this->hasMany(TeamMember::class);
    }

    // --- Ideas ---

    public function ideas(): HasMany
    {
        // all ideas created by this user, private and shared
        return $this->hasMany(Idea::class);
    }

    public function privateIdeas(): HasMany
    {
        // only ideas that haven't been shared to a team yet
        return $this->hasMany(Idea::class)->whereNull('team_id');
    }

    public function sharedIdeas(): HasMany
    {
        // only ideas that have been shared to a team
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
        // hackathons this user added to their team
        return $this->hasMany(Hackathon::class, 'created_by');
    }

    public function assignedMilestones(): HasMany
    {
        // milestones assigned to this user across all hackathons
        return $this->hasMany(HackathonMilestone::class, 'assigned_to');
    }

    // --- Invites ---

    public function sentInvites(): HasMany
    {
        // invites this user has sent to others
        return $this->hasMany(TeamInvite::class, 'invited_by');
    }

    // --- Helper methods ---

    public function isMemberOf(Team $team): bool
    {
        // for BelongsToMany we use wherePivot() to filter on the pivot table column
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
        // returns true if user is owner or admin of this team
        return in_array($this->roleIn($team), ['owner', 'admin']);
    }

    public function ownsTeam(Team $team): bool
    {
        return $team->owner_id === $this->id;
    }
}