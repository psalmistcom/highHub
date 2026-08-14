<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\StudentProfile::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:30'],
            'password' => ['nullable', 'string', 'min:8'],
            'school_class_id' => ['nullable', 'exists:school_classes,id'],
            'gender' => ['nullable', 'in:male,female'],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'address' => ['nullable', 'string', 'max:500'],
            'admission_date' => ['nullable', 'date'],
            'parent_profile_id' => ['nullable', 'exists:parent_profiles,id'],
            'relationship' => ['nullable', 'string', 'max:50'],
        ];
    }
}
