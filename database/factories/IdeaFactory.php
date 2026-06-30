<?php

namespace Database\Factories;

use App\Models\Idea;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Idea>
 */
class IdeaFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'      => User::factory(),

            'team_id'      => null,

            'title'        => fake()->sentence(4, false),

            'problem'      => fake()->paragraph(),
            'solution'     => fake()->paragraph(),
            'target_user'  => fake()->sentence(),
            'biggest_risk' => fake()->sentence(),

            'status'       => 'raw',

            'is_pinned'    => false,

            'shared_at'    => null,
        ];
    }


    // Use: Idea::factory()->shared($team)->create()
    public function shared(Team $team): static
    {
        return $this->state([
            'team_id'   => $team->id,
            'shared_at' => now(),
        ]);
    }

    public function pinned(): static
    {
        return $this->state(['is_pinned' => true]);
    }

    public function inDiscussion(): static
    {
        return $this->state(['status' => 'in_discussion']);
    }

    public function validated(): static
    {
        return $this->state(['status' => 'validated']);
    }

    public function shelved(): static
    {
        return $this->state(['status' => 'shelved']);
    }
}