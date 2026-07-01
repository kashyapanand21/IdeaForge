<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\Idea;
use App\Models\User;

class CommentPolicy
{
    public function create(User $user, Idea $idea): bool
    {
        if ($idea->user_id === $user->id) {
            return true;
        }

        if ($idea->isShared() && $idea->team !== null) {
            return $user->isMemberOf($idea->team);
        }

        return false;
    }

    public function update(User $user, Comment $comment): bool
    {
        return $comment->user_id === $user->id;
    }

    public function delete(User $user, Comment $comment): bool
    {
        return $comment->user_id === $user->id;
    }
}
