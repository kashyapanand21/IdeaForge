<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\IdeaFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $user_id
 * @property int|null $team_id
 * @property string $title
 * @property string $problem
 * @property string $solution
 * @property string $target_user
 * @property string $biggest_risk
 * @property string $status
 * @property bool $is_pinned
 * @property CarbonImmutable|null $shared_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
#[Fillable([
    'user_id',
    'team_id',
    'title',
    'problem',
    'solution',
    'target_user',
    'biggest_risk',
    'status',
    'is_pinned',
    'shared_at',
])]
class Idea extends Model
{
    /** @use HasFactory<IdeaFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'is_pinned' => 'boolean',
            'shared_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<User, Idea> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Team, Idea> */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /** @return HasMany<IdeaVote, Idea> */
    public function votes(): HasMany
    {
        return $this->hasMany(IdeaVote::class);
    }

    /** @return HasMany<Comment, Idea> */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /** @return HasMany<Hackathon, Idea> */
    public function hackathons(): HasMany
    {
        return $this->hasMany(Hackathon::class);
    }

    // --- Status helpers ---

    public function isPrivate(): bool
    {
        return $this->team_id === null;
    }

    public function isShared(): bool
    {
        return $this->team_id !== null;
    }

    public function isRaw(): bool
    {
        return $this->status === 'raw';
    }

    public function isInDiscussion(): bool
    {
        return $this->status === 'in_discussion';
    }

    public function isValidated(): bool
    {
        return $this->status === 'validated';
    }

    public function isShelved(): bool
    {
        return $this->status === 'shelved';
    }

    // --- Vote helpers ---

    public function upvoteCount(): int
    {
        return $this->votes->where('vote', 'up')->count();
    }

    public function downvoteCount(): int
    {
        return $this->votes->where('vote', 'down')->count();
    }

    public function voteScore(): int
    {
        return $this->upvoteCount() - $this->downvoteCount();
    }

    public function userVote(int $userId): ?string
    {
        /** @var IdeaVote|null $vote */
        $vote = $this->votes->firstWhere('user_id', $userId);

        return $vote?->vote;
    }
}
