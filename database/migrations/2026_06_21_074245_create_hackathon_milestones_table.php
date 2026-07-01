<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hackathon_milestones', function (Blueprint $table) {
            $table->id();

            $table->foreignId('hackathon_id')
                ->constrained('hackathons')
                ->onDelete('cascade');

            // nullable — milestone may not be assigned to anyone yet
            // onDelete('set null') — if the user is deleted, milestone still
            // exists but becomes unassigned rather than being deleted
            $table->foreignId('assigned_to')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null');

            $table->string('title');
            $table->text('description')->nullable();

            $table->enum('status', [
                'pending',
                'in_progress',
                'done',
            ])->default('pending');

            // when this milestone should be completed by
            $table->timestamp('due_date')->nullable();

            // null until the milestone is marked as done
            // stores the exact moment it was completed
            $table->timestamp('completed_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hackathon_milestones');
    }
};
