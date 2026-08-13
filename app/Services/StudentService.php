<?php

namespace App\Services;

use App\Models\ParentProfile;
use App\Models\StudentProfile;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class StudentService
{
    public function __construct(protected UserService $userService) {}

    public function paginate(?string $search = null, ?int $schoolClassId = null, int $perPage = 15): LengthAwarePaginator
    {
        return StudentProfile::query()
            ->with(['user', 'schoolClass'])
            ->when($search, fn(Builder $q) => $q->whereHas(
                'user',
                fn($u) => $u->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
            )->orWhere('admission_no', 'like', "%{$search}%"))
            ->when($schoolClassId, fn(Builder $q) => $q->where('school_class_id', $schoolClassId))
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function create(array $data): StudentProfile
    {
        $user = $this->userService->createUser([...$data, 'role' => 'student']);

        if (! empty($data['parent_profile_id'])) {
            $this->linkParent($user->studentProfile, $data['parent_profile_id'], $data['relationship'] ?? null);
        }

        return $user->studentProfile;
    }

    public function update(StudentProfile $student, array $data): StudentProfile
    {
        return DB::transaction(function () use ($student, $data) {
            $student->user->update(array_filter([
                'name' => $data['name'] ?? null,
                'email' => $data['email'] ?? null,
                'phone' => $data['phone'] ?? null,
            ], fn($v) => ! is_null($v)));

            $student->update(array_filter([
                'school_class_id' => $data['school_class_id'] ?? null,
                'gender' => $data['gender'] ?? null,
                'date_of_birth' => $data['date_of_birth'] ?? null,
                'address' => $data['address'] ?? null,
            ], fn($v) => ! is_null($v)));

            return $student->fresh(['user', 'schoolClass']);
        });
    }

    public function linkParent(StudentProfile $student, int $parentProfileId, ?string $relationship = null): void
    {
        $student->parents()->syncWithoutDetaching([
            $parentProfileId => ['relationship' => $relationship],
        ]);
    }

    public function delete(StudentProfile $student): void
    {
        DB::transaction(function () use ($student) {
            $student->user()->delete(); // soft delete cascades logically; profile kept for records
        });
    }

    public function transferClass(StudentProfile $student, int $newSchoolClassId): StudentProfile
    {
        $student->update(['school_class_id' => $newSchoolClassId]);

        return $student->fresh('schoolClass');
    }
}
