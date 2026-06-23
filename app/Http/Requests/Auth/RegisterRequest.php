<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            // Password::defaults() uses the rules defined in AppServiceProvider
            // In production: min 12 chars, mixed case, numbers, symbols, not breached
            // In development: no restrictions (so you can use "password" locally)
            'password' => ['required', 'confirmed', Password::defaults()],
        ];
    }
}
