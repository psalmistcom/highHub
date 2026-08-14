<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('student'));
    }

    public function rules(): array
    {
        $studentId = $this->route('student')?->id;

        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'unique:users,email,' . $this->route('student')?->user_id],
            'phone' => ['nullable', 'string', 'max:30'],
            'school_class_id' => ['nullable', 'exists:school_classes,id'],
            'gender' => ['nullable', 'in:male,female'],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'address' => ['nullable', 'string', 'max:500'],
        ];
    }
}
