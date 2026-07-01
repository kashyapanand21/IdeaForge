<?php

namespace App\Http\Requests\Idea;

use App\Models\Idea;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateIdeaRequest extends FormRequest
{
    public function authorize(): bool
    {
        // $this->route('idea') gives us the Idea model via route model binding
        // We check that the logged-in user owns this idea
        // Policy will also enforce this — but FormRequest authorize() is
        // a good first gate before even running validation
        /** @var Idea $idea */
        $idea = $this->route('idea');

        return $idea->user_id === $this->user()->id;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'problem' => ['sometimes', 'required', 'string'],
            'solution' => ['sometimes', 'required', 'string'],
            'target_user' => ['sometimes', 'required', 'string'],
            'biggest_risk' => ['sometimes', 'required', 'string'],
            'status' => ['sometimes', Rule::in(['raw', 'in_discussion', 'validated', 'shelved'])],
        ];
    }
}
