<?php

namespace Database\Factories;

use App\Models\Team;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TeamMember>
 */
class TeamMemberFactory extends Factory
{
    public function definition(): array
    {
        return [
            'team_id' => Team::factory(),
            'user_id' => User::factory(),
            'role'    => 'member',
        ];
    }

    public function owner(): static
    {
        return $this->state(['role' => 'owner']);
    }

    public function admin(): static
    {
        return $this->state(['role' => 'admin']);
    }
}