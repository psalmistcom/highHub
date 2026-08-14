<?php

namespace App\Policies;

use App\Models\User;

class ExamPolicy
{
    public function create(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'teacher']);
    }
}
