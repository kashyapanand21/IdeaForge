<?php

namespace App\Models;

use Database\Factories\HackathonMilestoneFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $hackathon_id
 * @property int|null $assigned_to
 * @property string $title
 * @property string|null $description
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $due_date
 * @property \Illuminate\Support\Carbon|null $completed_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
#[Fillable([
    'hackathon_id',
    'assigned_to',
    'title',
    'description',
    'status',
    'due_date',
    'completed_at',
])]
class HackathonMilestone extends Model
{
    /** @use HasFactory<HackathonMilestoneFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'due_date'     => 'datetime',
            // completed_at is null until the milestone is marked done
            // when marked done we store the exact timestamp
            // this lets us know not just IF it was completed but WHEN
            'completed_at' => 'datetime',
        ];
    }

    public function hackathon(): BelongsTo
    {
        return $this->belongsTo(Hackathon::class);
    }

    public function assignedTo(): BelongsTo
    {
        // nullable — a milestone may not be assigned to anyone yet
        return $this->belongsTo(User::class, 'assigned_to');
    }

    // --- Status helpers ---

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isInProgress(): bool
    {
        return $this->status === 'in_progress';
    }

    public function isDone(): bool
    {
        return $this->status === 'done';
    }

    // --- Date helpers ---

    public function isOverdue(): bool
    {
        // overdue means due date has passed but milestone is not done yet
        return $this->due_date !== null
            && $this->due_date->isPast()
            && ! $this->isDone();
    }

    public function markAsDone(): bool
    {
        // sets both status and completed_at in one call
        // returns true/false based on whether save succeeded
        return $this->update([
            'status'       => 'done',
            'completed_at' => now(),
        ]);
    }

    public function isOwnedBy(int $userId): bool
    {
        return $this->assigned_to === $userId;
    }
}