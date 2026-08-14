<?php

namespace App\Policies;

use App\Models\StudentProfile;
use App\Models\User;

/**
 * Reference policy - the same shape (admin: full access, teacher: read within
 * their classes, parent: read only their own linked children, student: read self)
 * applies to TeacherPolicy, GradePolicy, AttendancePolicy, InvoicePolicy, etc.
 */
class StudentProfilePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'teacher', 'bursar']);
    }

    public function view(User $user, StudentProfile $student): bool
    {
        return match ($user->role->value) {
            'admin', 'teacher', 'bursar' => true,
            'student' => $user->studentProfile?->id === $student->id,
            'parent' => $user->parentProfile?->students->contains('id', $student->id) ?? false,
            default => false,
        };
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, StudentProfile $student): bool
    {
        return $user->hasRole('admin');
    }

    public function delete(User $user, StudentProfile $student): bool
    {
        return $user->hasRole('admin');
    }
}
