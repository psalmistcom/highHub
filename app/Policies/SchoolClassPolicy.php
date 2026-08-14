<?php

namespace App\Policies;

use App\Models\SchoolClass;
use App\Models\User;

class SchoolClassPolicy
{
    public function create(User $user): bool { return $user->hasRole('admin'); }
    public function update(User $user, SchoolClass $class): bool { return $user->hasRole('admin'); }
    public function delete(User $user, SchoolClass $class): bool { return $user->hasRole('admin'); }
}
