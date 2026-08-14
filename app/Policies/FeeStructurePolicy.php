<?php

namespace App\Policies;

use App\Models\User;

class FeeStructurePolicy
{
    public function create(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'bursar']);
    }
}
