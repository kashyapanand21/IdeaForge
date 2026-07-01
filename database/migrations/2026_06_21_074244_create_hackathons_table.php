<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hackathons', function (Blueprint $table) {
            $table->id();

            $table->foreignId('team_id')
                ->constrained('teams')
                ->onDelete('cascade');

            // nullable — team might not have picked an idea yet
            $table->foreignId('idea_id')
                ->nullable()
                ->constrained('ideas')
                ->onDelete('set null');

            // the team member who added this hackathon entry
            $table->foreignId('created_by')
                ->constrained('users')
                ->onDelete('cascade');

            $table->string('name');
            $table->string('organizer')->nullable();
            $table->string('website')->nullable();

            // the problem statement or theme of the hackathon
            $table->text('theme')->nullable();

            // online or offline
            $table->enum('mode', ['online', 'offline'])->default('online');

            // only relevant if mode is offline
            $table->string('location')->nullable();

            $table->unsignedTinyInteger('team_size')->nullable();

            // storing as string because prize can be
            // "₹50,000" or "$10,000 + internship" etc.
            $table->string('prize_pool')->nullable();

            // hackathon lifecycle
            $table->enum('status', [
                'interested',
                'registered',
                'building',
                'submitted',
                'results',
            ])->default('interested');

            // three important dates
            $table->timestamp('registration_deadline')->nullable();
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hackathons');
    }
};
