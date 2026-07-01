<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_members', function (Blueprint $table) {
            $table->id();

            $table->foreignId('team_id')
                ->constrained('teams')
                ->onDelete('cascade');

            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            // role can only be one of these three values
            // enum enforces this at the database level, not just application level
            $table->enum('role', ['owner', 'admin', 'member'])->default('member');

            $table->timestamps();

            // a user can only be a member of the same team once
            // this unique constraint prevents duplicate rows at the database level
            $table->unique(['team_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_members');
    }
};
