<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MarkAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['admin', 'teacher']);
    }

    public function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'subject_id' => ['nullable', 'exists:subjects,id'],
            'entries' => ['required', 'array', 'min:1'],
            'entries.*.student_profile_id' => ['required', 'exists:student_profiles,id'],
            'entries.*.status' => ['required', 'in:present,absent,late,excused'],
            'entries.*.remarks' => ['nullable', 'string', 'max:255'],
        ];
    }
}
