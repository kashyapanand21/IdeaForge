<?php

namespace App\Http\Requests\Team;

use Illuminate\Foundation\Http\FormRequest;

class TransferOwnershipRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->ownsTeam($this->route('team'));
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            // user_id must exist in the users table
            'user_id' => ['required', 'integer', 'exists:users,id'],
        ];
    }
}
