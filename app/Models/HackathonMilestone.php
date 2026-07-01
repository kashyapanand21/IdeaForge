<?php

namespace App\Models;

use Database\Factories\HackathonMilestoneFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $hackathon_id
 * @property int|null $assigned_to
 * @property string $title
 * @property string|null $description
 * @property string $status
 * @property Carbon|null $due_date
 * @property Carbon|null $completed_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
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
            'due_date' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<Hackathon, HackathonMilestone> */
    public function hackathon(): BelongsTo
    {
        return $this->belongsTo(Hackathon::class);
    }

    /** @return BelongsTo<User, HackathonMilestone> */
    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function isPending(): bool { return $this->status === 'pending'; }
    public function isInProgress(): bool { return $this->status === 'in_progress'; }
    public function isDone(): bool { return $this->status === 'done'; }

    public function isOverdue(): bool
    {
        return $this->due_date !== null
            && $this->due_date->isPast()
            && ! $this->isDone();
    }

    public function markAsDone(): bool
    {
        return $this->update([
            'status' => 'done',
            'completed_at' => now(),
        ]);
    }

    public function isOwnedBy(int $userId): bool
    {
        return $this->assigned_to === $userId;
    }
}