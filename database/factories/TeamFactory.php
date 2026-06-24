<?php

namespace Database\Factories;

use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Team>
 */
class TeamFactory extends Factory
{
    public function definition(): array
    {
        return [
            // owner_id will usually be overridden in tests
            // but we need a fallback so the factory works standalone
            'owner_id'    => User::factory(),
            'name'        => fake()->words(3, true),
            'description' => fake()->sentence(),
            'avatar'      => null,
        ];
    }
}