<?php

namespace App\Policies;

use App\Models\Idea;
use App\Models\User;

class IdeaPolicy
{
    public function create(User $user): bool
    {
        // Any authenticated user can create an idea
        return true;
    }

    public function view(User $user, Idea $idea): bool
    {
        // Owner can always view their own idea
        if ($idea->user_id === $user->id) {
            return true;
        }

        // If shared to a team, any member of that team can view it
        if ($idea->isShared()) {
            return $user->isMemberOf($idea->team);
        }

        // Private idea, not the owner — deny
        return false;
    }

    public function update(User $user, Idea $idea): bool
    {
        // Only the owner can edit the content of an idea
        return $idea->user_id === $user->id;
    }

    public function delete(User $user, Idea $idea): bool
    {
        // Only the owner can delete their idea
        return $idea->user_id === $user->id;
    }

    public function share(User $user, Idea $idea): bool
    {
        // Only the owner can share their private idea to a team
        return $idea->user_id === $user->id;
    }

    public function changeStatus(User $user, Idea $idea): bool
    {
        // Owner can always change status
        if ($idea->user_id === $user->id) {
            return true;
        }

        // If the idea is shared, team admins and owners can also change status
        // $idea->team is already loaded via route model binding in most cases
        if ($idea->isShared() && $idea->team !== null) {
            return $user->canManage($idea->team);
        }

        return false;
    }

    public function pin(User $user, Idea $idea): bool
    {
        // Pinning only makes sense on a shared idea — it affects the team board
        // Owner or team admin/owner can pin
        if (! $idea->isShared() || $idea->team === null) {
            return false;
        }

        return $idea->user_id === $user->id || $user->canManage($idea->team);
    }
}