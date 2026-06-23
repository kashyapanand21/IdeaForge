<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    // authorize() controls who can submit this form
    // returning true means "any guest can attempt login"
    public function authorize(): bool
    {
        return true;
    }

    // rules() replaces the inline $request->validate([...]) in your controller
    // Laravel runs these BEFORE your controller method executes
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }
}
