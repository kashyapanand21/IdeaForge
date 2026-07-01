<?php

namespace App\Models;

use Database\Factories\TeamFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $owner_id
 * @property string $name
 * @property string|null $description
 * @property string|null $avatar
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['owner_id', 'name', 'description', 'avatar'])]
class Team extends Model
{
    /** @use HasFactory<TeamFactory> */
    use HasFactory;

    public function owner(): BelongsTo
    {
        // A team belongs to a user who created it (the owner)
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function members(): BelongsToMany
    {
        // Many-to-many: a team has many users through team_members table
        // withPivot gives us access to the 'role' column on the pivot table
        // withTimestamps tracks when the member joined
        return $this->belongsToMany(User::class, 'team_members')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function teamMembers(): HasMany
    {
        // Direct access to TeamMember records
        // useful when you need the pivot row itself, not just the user
        return $this->hasMany(TeamMember::class);
    }

    public function invites(): HasMany
    {
        // All pending/accepted invites for this team
        return $this->hasMany(TeamInvite::class);
    }

    public function ideas(): HasMany
    {
        // All ideas shared to this team
        return $this->hasMany(Idea::class);
    }

    public function hackathons(): HasMany
    {
        // All hackathons this team is participating in
        return $this->hasMany(Hackathon::class);
    }
}
