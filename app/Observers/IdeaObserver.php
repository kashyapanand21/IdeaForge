<?php

namespace App\Observers;

use App\Models\Idea;

class IdeaObserver
{
    /**
     * Handle the Idea "created" event.
     */
    public function created(Idea $idea): void
    {
        //
    }

    /**
     * Handle the Idea "updated" event.
     */
    public function updated(Idea $idea): void
    {
        //
    }

    /**
     * Handle the Idea "deleted" event.
     */
    public function deleted(Idea $idea): void
    {
        //
    }

    /**
     * Handle the Idea "restored" event.
     */
    public function restored(Idea $idea): void
    {
        //
    }

    /**
     * Handle the Idea "force deleted" event.
     */
    public function forceDeleted(Idea $idea): void
    {
        //
    }

    public function updating(Idea $idea): void
    {
        if ($idea->isDirty('team_id') && $idea->getOriginal('team_id') === null) {
            $idea->shared_at = now();
        }
    }
}
