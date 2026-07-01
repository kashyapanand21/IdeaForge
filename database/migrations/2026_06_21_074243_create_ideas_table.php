<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ideas', function (Blueprint $table) {
            $table->id();

            // the user who created this idea
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            // nullable — null means private, a value means shared to that team
            // this single column is the core mechanic of private vs shared ideas
            $table->foreignId('team_id')
                ->nullable()
                ->constrained('teams')
                ->onDelete('cascade');

            $table->string('title');

            // the four structured fields that force the user to think
            // using text() because these can be long form answers
            $table->text('problem');
            $table->text('solution');
            $table->text('target_user');
            $table->text('biggest_risk');

            // idea lifecycle — raw is the default when first created
            $table->enum('status', [
                'raw',
                'in_discussion',
                'validated',
                'shelved',
            ])->default('raw');

            // pinned ideas appear at the top of the team board
            $table->boolean('is_pinned')->default(false);

            // timestamp of when the idea was shared to a team
            // null means it has never been shared
            $table->timestamp('shared_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ideas');
    }
};
