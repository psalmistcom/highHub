<?php

namespace App\Policies;

use App\Models\Subject;
use App\Models\User;

class SubjectPolicy
{
    public function create(User $user): bool { return $user->hasRole('admin'); }
    public function update(User $user, Subject $subject): bool { return $user->hasRole('admin'); }
    public function delete(User $user, Subject $subject): bool { return $user->hasRole('admin'); }
}
