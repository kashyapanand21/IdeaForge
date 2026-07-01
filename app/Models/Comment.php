<?php

namespace App\Models;

use Database\Factories\CommentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $idea_id
 * @property int $user_id
 * @property int|null $parent_id
 * @property string $body
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['idea_id', 'user_id', 'parent_id', 'body'])]
class Comment extends Model
{
    /** @use HasFactory<CommentFactory> */
    use HasFactory;

    public function idea(): BelongsTo
    {
        return $this->belongsTo(Idea::class);
    }

    public function user(): BelongsTo
    {
        // The user who wrote this comment
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        // If this comment is a reply, this points to the parent comment
        // nullable — null means this is a top level comment, not a reply
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        // All direct replies to this comment
        // we only go one level deep — replies cannot have replies
        return $this->hasMany(Comment::class, 'parent_id');
    }

    public function isReply(): bool
    {
        // if parent_id exists, this comment is a reply to another comment
        return $this->parent_id !== null;
    }

    public function isTopLevel(): bool
    {
        return $this->parent_id === null;
    }

    public function isOwnedBy(int $userId): bool
    {
        // useful in controllers to check before allowing edit or delete
        return $this->user_id === $userId;
    }
}
