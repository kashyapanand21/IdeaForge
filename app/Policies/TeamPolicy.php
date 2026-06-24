<?php

namespace App\Policies;

use App\Models\Team;
use App\Models\User;

class TeamPolicy
{
    // Any authenticated user can create a team
    public function create(User $user): bool
    {
        return true;
    }

    // Only owner or admin can invite members
    public function invite(User $user, Team $team): bool
    {
        return $user->canManage($team);
    }

    // Only owner or admin can remove members
    public function removeMember(User $user, Team $team): bool
    {
        return $user->canManage($team);
    }

    // Any member can leave (but owner cannot — must transfer first)
    public function leave(User $user, Team $team): bool
    {
        return $user->isMemberOf($team) && ! $user->ownsTeam($team);
    }

    // Only owner can transfer ownership
    public function transferOwnership(User $user, Team $team): bool
    {
        return $user->ownsTeam($team);
    }

    // Only owner can delete the team
    public function delete(User $user, Team $team): bool
    {
        return $user->ownsTeam($team);
    }

    // Only owner or admin can update team settings
    public function update(User $user, Team $team): bool
    {
        return $user->canManage($team);
    }
}
