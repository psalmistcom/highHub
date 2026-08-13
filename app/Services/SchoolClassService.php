<?php

namespace App\Services;

use App\Models\SchoolClass;
use Illuminate\Pagination\LengthAwarePaginator;

class SchoolClassService
{
    public function paginate(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        return SchoolClass::query()
            ->withCount('students')
            ->with('classTeacher.user')
            ->when($search, fn ($q) => $q->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function create(array $data): SchoolClass
    {
        return SchoolClass::create($data);
    }

    public function update(SchoolClass $schoolClass, array $data): SchoolClass
    {
        $schoolClass->update($data);

        return $schoolClass->fresh();
    }

    public function attachSubjects(SchoolClass $schoolClass, array $subjectIds): void
    {
        $schoolClass->subjects()->syncWithoutDetaching($subjectIds);
    }

    public function delete(SchoolClass $schoolClass): void
    {
        $schoolClass->delete();
    }
}
