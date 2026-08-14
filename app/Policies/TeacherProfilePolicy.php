<?php

namespace App\Policies;

use App\Models\TeacherProfile;
use App\Models\User;

class TeacherProfilePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'teacher', 'bursar']);
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, TeacherProfile $teacher): bool
    {
        return $user->hasRole('admin');
    }

    public function delete(User $user, TeacherProfile $teacher): bool
    {
        return $user->hasRole('admin');
    }
}
