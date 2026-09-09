<?php

namespace App\Http\Requests;

use App\Support\ContentBlockTypes;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreContentBlockRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Ownership of the parent page is enforced by the controller
        // via the PagePolicy (see ContentBlockController::store).
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'string', Rule::in(ContentBlockTypes::all())],
            'data' => ['required', 'array'],
        ];
    }

    /**
     * Beyond "data is an array", make sure it actually contains
     * what the chosen block type needs (e.g. a CTA needs a url).
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            ContentBlockTypes::validateShape(
                $validator,
                $this->input('type'),
                $this->input('data')
            );
        });
    }

    public function messages(): array
    {
        return [
            'type.in' => 'Unsupported block type. Allowed types: '.implode(', ', ContentBlockTypes::all()).'.',
        ];
    }
}