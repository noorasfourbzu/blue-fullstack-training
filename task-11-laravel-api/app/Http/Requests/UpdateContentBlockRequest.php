<?php

namespace App\Http\Requests;

use App\Support\ContentBlockTypes;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateContentBlockRequest extends FormRequest
{
    /**
     * Was previously hard-coded to `false`, which made every
     * "edit block" request 403 no matter who sent it. Ownership
     * of the parent page is checked in the controller via the
     * PagePolicy (see ContentBlockController::update).
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * An update replaces a block's type + content together (not its
     * position, which is only changed via the reorder endpoint), so
     * both fields are required — a block can't be left with a type
     * that no longer matches its data.
     */
    public function rules(): array
    {
        return [
            'type' => ['required', 'string', Rule::in(ContentBlockTypes::all())],
            'data' => ['required', 'array'],
        ];
    }

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