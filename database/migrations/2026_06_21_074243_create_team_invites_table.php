<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_invites', function (Blueprint $table) {
            $table->id();

            $table->foreignId('team_id')
                ->constrained('teams')
                ->onDelete('cascade');

            // the user who sent the invite
            $table->foreignId('invited_by')
                ->constrained('users')
                ->onDelete('cascade');

            // we invite by email — the person may not have an account yet
            $table->string('email');

            $table->enum('role', ['admin', 'member'])->default('member');

            // unique token sent in the invite link
            // e.g. /invites/accept/abc123xyz
            $table->string('token')->unique();

            $table->enum('status', ['pending', 'accepted', 'declined', 'expired'])
                ->default('pending');

            // when this invite stops being valid
            $table->timestamp('expires_at')->nullable();

            $table->timestamps();

            // a person should not have two pending invites to the same team
            $table->unique(['team_id', 'email']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_invites');
    }
};