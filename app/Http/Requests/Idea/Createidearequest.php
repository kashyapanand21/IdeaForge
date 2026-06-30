<?php

namespace App\Http\Requests\Idea;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateIdeaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'title'        => ['required', 'string', 'max:255'],

            'problem'      => ['required', 'string'],
            'solution'     => ['required', 'string'],
            'target_user'  => ['required', 'string'],
            'biggest_risk' => ['required', 'string'],

            'status'       => ['sometimes', Rule::in(['raw', 'in_discussion', 'validated', 'shelved'])],
        ];
    }
}