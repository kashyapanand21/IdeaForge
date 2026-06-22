<?php

namespace App\Models;

use Database\Factories\HackathonFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
 * @property \Illuminate\Support\Carbon|null $registration_deadline
 * @property \Illuminate\Support\Carbon|null $starts_at
 * @property \Illuminate\Support\Carbon|null $ends_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
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
            // all three are dates so we cast them to Carbon
            // this lets us do $hackathon->ends_at->diffForHumans()
            // or $hackathon->starts_at->isPast() etc.
            'registration_deadline' => 'datetime',
            'starts_at'             => 'datetime',
            'ends_at'               => 'datetime',
        ];
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function idea(): BelongsTo
    {
        // nullable — a hackathon may not have a linked idea yet
        // team might still be deciding what to build
        return $this->belongsTo(Idea::class);
    }

    public function createdBy(): BelongsTo
    {
        // The team member who added this hackathon
        return $this->belongsTo(User::class, 'created_by');
    }

    public function milestones(): HasMany
    {
        return $this->hasMany(HackathonMilestone::class);
    }

    // --- Status helpers ---

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

    // --- Date helpers ---

    public function isOngoing(): bool
    {
        // hackathon has started but not ended yet
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

        // Carbon's diffInDays gives us the number of days between now and ends_at
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