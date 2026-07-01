<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Policy check happens in controller, not here
    }

    /** @return array<string, array<int, string>> */
    public function rules(): array
    {
        return [
            'vote' => ['required', 'in:up,down'],
        ];
    }
}
