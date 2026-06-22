<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('idea_votes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('idea_id')
                ->constrained('ideas')
                ->onDelete('cascade');

            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            // only two possible values — up or down
            $table->enum('vote', ['up', 'down']);

            $table->timestamps();

            // the most important constraint in this table
            // one user can only have one vote per idea
            // trying to insert a second vote for the same idea+user
            // will fail at the database level
            // in the controller we use updateOrCreate() to handle this
            $table->unique(['idea_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('idea_votes');
    }
};