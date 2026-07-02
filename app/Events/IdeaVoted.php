<?php

namespace App\Events;

use App\Models\IdeaVote;
use Illuminate\Foundation\Events\Dispatchable;

class IdeaVoted
{
    use Dispatchable;

    public function __construct(public IdeaVote $vote) {}
}
