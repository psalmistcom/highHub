<?php

namespace App\Services;

use App\Models\ParentProfile;
use App\Models\StudentProfile;
use App\Models\TeacherProfile;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Central place for creating/deactivating users of any role and their
 * matching profile row. Only Admins should ever call this .
 */
class UserService
{
    public function createUser(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'role' => $data['role'],
                'password' => Hash::make($data['password'] ?? Str::random(12)),
            ]);

            match ($data['role']) {
                'student' => StudentProfile::create([
                    'user_id' => $user->id,
                    'admission_no' => $data['admission_no'] ?? $this->generateAdmissionNo(),
                    'school_class_id' => $data['school_class_id'] ?? null,
                    'gender' => $data['gender'] ?? null,
                    'date_of_birth' => $data['date_of_birth'] ?? null,
                    'address' => $data['address'] ?? null,
                    'admission_date' => $data['admission_date'] ?? now(),
                ]),
                'teacher' => TeacherProfile::create([
                    'user_id' => $user->id,
                    'staff_id' => $data['staff_id'] ?? $this->generateStaffId('T'),
                    'subject_specialization' => $data['subject_specialization'] ?? null,
                    'qualification' => $data['qualification'] ?? null,
                    'date_joined' => $data['date_joined'] ?? now(),
                ]),
                'parent' => ParentProfile::create([
                    'user_id' => $user->id,
                    'occupation' => $data['occupation'] ?? null,
                    'address' => $data['address'] ?? null,
                ]),
                default => null, // admin / bursar / lab_attendant need no extra profile row
            };

            return $user->fresh(['studentProfile', 'teacherProfile', 'parentProfile']);
        });
    }

    public function deactivate(User $user): void
    {
        $user->update(['is_active' => false]);
    }

    public function activate(User $user): void
    {
        $user->update(['is_active' => true]);
    }

    public function resetPassword(User $user, string $newPassword): void
    {
        $user->update(['password' => Hash::make($newPassword)]);
    }

    protected function generateAdmissionNo(): string
    {
        return 'ADM-' . now()->format('y') . '-' . str_pad((string) (StudentProfile::count() + 1), 4, '0', STR_PAD_LEFT);
    }

    protected function generateStaffId(string $prefix): string
    {
        return $prefix . '-' . now()->format('y') . '-' . str_pad((string) (TeacherProfile::count() + 1), 4, '0', STR_PAD_LEFT);
    }
}
