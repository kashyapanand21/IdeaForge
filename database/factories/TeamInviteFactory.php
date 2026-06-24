<?php

namespace Database\Factories;

use App\Models\Team;
use App\Models\TeamInvite;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<TeamInvite>
 */
class TeamInviteFactory extends Factory
{
    public function definition(): array
    {
        return [
            'team_id'    => Team::factory(),
            'invited_by' => User::factory(),
            'email'      => fake()->safeEmail(),
            'role'       => 'member',
            'token'      => Str::random(32),
            'status'     => 'pending',
            'expires_at' => now()->addHours(48),
        ];
    }

    public function expired(): static
    {
        return $this->state(['expires_at' => now()->subHour()]);
    }

    public function accepted(): static
    {
        return $this->state(['status' => 'accepted']);
    }
}