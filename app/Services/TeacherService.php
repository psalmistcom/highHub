<?php

namespace App\Services;

use App\Models\TeacherProfile;
use Illuminate\Pagination\LengthAwarePaginator;

class TeacherService
{
    public function __construct(protected UserService $userService) {}

    public function paginate(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        return TeacherProfile::query()
            ->with('user')
            ->when($search, fn ($q) => $q->whereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%")))
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function create(array $data): TeacherProfile
    {
        $user = $this->userService->createUser([...$data, 'role' => 'teacher']);

        return $user->teacherProfile;
    }

    public function update(TeacherProfile $teacher, array $data): TeacherProfile
    {
        $teacher->user->update(array_filter([
            'name' => $data['name'] ?? null,
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
        ], fn ($v) => ! is_null($v)));

        $teacher->update(array_filter([
            'subject_specialization' => $data['subject_specialization'] ?? null,
            'qualification' => $data['qualification'] ?? null,
        ], fn ($v) => ! is_null($v)));

        return $teacher->fresh('user');
    }

    public function assignToClassSubject(TeacherProfile $teacher, int $schoolClassId, int $subjectId, array $schedule = []): void
    {
        $teacher->teachingAssignments()->firstOrCreate(
            ['school_class_id' => $schoolClassId, 'subject_id' => $subjectId],
            $schedule
        );
    }

    public function delete(TeacherProfile $teacher): void
    {
        $teacher->user()->delete();
    }
}
