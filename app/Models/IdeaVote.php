<?php

namespace App\Models;

use Database\Factories\IdeaVoteFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $idea_id
 * @property int $user_id
 * @property string $vote
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['idea_id', 'user_id', 'vote'])]
class IdeaVote extends Model
{
    /** @use HasFactory<IdeaVoteFactory> */
    use HasFactory;

    /** @return BelongsTo<Idea, IdeaVote> */
    public function idea(): BelongsTo
    {
        return $this->belongsTo(Idea::class);
    }

    /** @return BelongsTo<User, IdeaVote> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isUpvote(): bool
    {
        return $this->vote === 'up';
    }

    public function isDownvote(): bool
    {
        return $this->vote === 'down';
    }
}
