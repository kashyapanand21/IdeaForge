<?php

namespace App\Models;

use Database\Factories\HackathonFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $team_id
 * @property int|null $idea_id
 * @property int $created_by
 * @property string $name
 * @property string|null $organizer
 * @property string|null $website
 * @property string|null $theme
 * @property string $mode
 * @property string|null $location
 * @property int|null $team_size
 * @property string|null $prize_pool
 * @property string $status
 * @property Carbon|null $registration_deadline
 * @property Carbon|null $starts_at
 * @property Carbon|null $ends_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'team_id',
    'idea_id',
    'created_by',
    'name',
    'organizer',
    'website',
    'theme',
    'mode',
    'location',
    'team_size',
    'prize_pool',
    'status',
    'registration_deadline',
    'starts_at',
    'ends_at',
])]
class Hackathon extends Model
{
    /** @use HasFactory<HackathonFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'registration_deadline' => 'datetime',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<Team, Hackathon> */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /** @return BelongsTo<Idea, Hackathon> */
    public function idea(): BelongsTo
    {
        return $this->belongsTo(Idea::class);
    }

    /** @return BelongsTo<User, Hackathon> */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /** @return HasMany<HackathonMilestone, Hackathon> */
    public function milestones(): HasMany
    {
        return $this->hasMany(HackathonMilestone::class);
    }

    public function isInterested(): bool
    {
        return $this->status === 'interested';
    }

    public function isRegistered(): bool
    {
        return $this->status === 'registered';
    }

    public function isBuilding(): bool
    {
        return $this->status === 'building';
    }

    public function isSubmitted(): bool
    {
        return $this->status === 'submitted';
    }

    public function hasResults(): bool
    {
        return $this->status === 'results';
    }

    public function isOngoing(): bool
    {
        return $this->starts_at !== null
            && $this->starts_at->isPast()
            && $this->ends_at !== null
            && $this->ends_at->isFuture();
    }

    public function isUpcoming(): bool
    {
        return $this->starts_at !== null && $this->starts_at->isFuture();
    }

    public function isOver(): bool
    {
        return $this->ends_at !== null && $this->ends_at->isPast();
    }

    public function daysUntilDeadline(): ?int
    {
        if ($this->ends_at === null || $this->isOver()) {
            return null;
        }

        return (int) now()->diffInDays($this->ends_at);
    }

    public function isOnline(): bool
    {
        return $this->mode === 'online';
    }

    public function isOffline(): bool
    {
        return $this->mode === 'offline';
    }
}
