<?php

namespace App\Services;

use App\Models\Subject;
use Illuminate\Pagination\LengthAwarePaginator;

class SubjectService
{
    public function paginate(?string $search = null, int $perPage = 20): LengthAwarePaginator
    {
        return Subject::query()
            ->when($search, fn ($q) => $q->where('name', 'like', "%{$search}%")->orWhere('code', 'like', "%{$search}%"))
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function create(array $data): Subject
    {
        return Subject::create($data);
    }

    public function update(Subject $subject, array $data): Subject
    {
        $subject->update($data);

        return $subject->fresh();
    }

    public function delete(Subject $subject): void
    {
        $subject->delete();
    }
}
