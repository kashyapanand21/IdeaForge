<?php

namespace App\Policies;

use App\Models\Team;
use App\Models\User;

class TeamPolicy
{
    public function create(User $user): bool
    {
        return true;
    }

    public function view(User $user, Team $team): bool
    {
        return $user->isMemberOf($team);
    }

    public function invite(User $user, Team $team): bool
    {
        return $user->canManage($team);
    }

    public function removeMember(User $user, Team $team): bool
    {
        return $user->canManage($team);
    }

    public function leave(User $user, Team $team): bool
    {
        return $user->isMemberOf($team) && ! $user->ownsTeam($team);
    }

    public function transferOwnership(User $user, Team $team): bool
    {
        return $user->ownsTeam($team);
    }

    public function delete(User $user, Team $team): bool
    {
        return $user->ownsTeam($team);
    }

    public function update(User $user, Team $team): bool
    {
        return $user->canManage($team);
    }
}