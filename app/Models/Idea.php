<?php

namespace App\Models;

use Database\Factories\IdeaFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

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
//  * @property Carbon|null $shared_at'
 * @property \Carbon\CarbonImmutable|null $shared_at
//  * @property Carbon|null $created_at
 * @property \Carbon\CarbonImmutable|null $created_at
//  * @property Carbon|null $updated_at
 * @property \Carbon\CarbonImmutable|null $updated_at
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
            // cast to boolean so $idea->is_pinned returns true/false not 1/0
            'is_pinned' => 'boolean',
            // cast to Carbon so we can do $idea->shared_at->diffForHumans()
            'shared_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        // The user who created this idea
        return $this->belongsTo(User::class);
    }

    public function team(): BelongsTo
    {
        // nullable — if team_id is null, this is a private idea
        return $this->belongsTo(Team::class);
    }

    public function votes(): HasMany
    {
        return $this->hasMany(IdeaVote::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function hackathons(): HasMany
    {
        // An idea can be linked to multiple hackathons
        return $this->hasMany(Hackathon::class);
    }

    // --- Status helpers ---

    public function isPrivate(): bool
    {
        // If team_id is null, the idea hasn't been shared yet
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
        // counts only upvotes from the already loaded votes relationship
        // because of automaticallyEagerLoadRelationships this won't cause N+1
        return $this->votes->where('vote', 'up')->count();
    }

    public function downvoteCount(): int
    {
        return $this->votes->where('vote', 'down')->count();
    }

    public function voteScore(): int
    {
        // net score: upvotes minus downvotes
        // useful for sorting ideas by popularity
        return $this->upvoteCount() - $this->downvoteCount();
    }

    public function userVote(int $userId): ?string
    {
        // returns 'up', 'down', or null if the user hasn't voted
        $vote = $this->votes->firstWhere('user_id', $userId);

        return $vote?->vote;
    }
}
