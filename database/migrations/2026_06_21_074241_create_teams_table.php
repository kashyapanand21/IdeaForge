<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teams', function (Blueprint $table) {
            $table->id();

            // the user who owns this team
            // constrained() automatically references users.id
            // onDelete('cascade') — if the owner is deleted, delete their teams too
            $table->foreignId('owner_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->string('name');
            $table->text('description')->nullable();

            // nullable avatar — stores the file path, not the image itself
            $table->string('avatar')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};
