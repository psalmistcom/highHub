<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\SchoolClass;
use Illuminate\Support\Facades\DB;

class AttendanceService
{
    /**
     * Mark a whole class's attendance for a given day in one transaction.
     * $entries = [['student_profile_id' => 1, 'status' => 'present', 'remarks' => null], ...]
     */
    public function markForClass(SchoolClass $schoolClass, string $date, array $entries, ?int $subjectId, int $markedBy): void
    {
        DB::transaction(function () use ($schoolClass, $date, $entries, $subjectId, $markedBy) {
            foreach ($entries as $entry) {
                Attendance::updateOrCreate(
                    [
                        'student_profile_id' => $entry['student_profile_id'],
                        'subject_id' => $subjectId,
                        'date' => $date,
                    ],
                    [
                        'school_class_id' => $schoolClass->id,
                        'status' => $entry['status'],
                        'remarks' => $entry['remarks'] ?? null,
                        'marked_by' => $markedBy,
                    ]
                );
            }
        });
    }

    public function forClassOnDate(SchoolClass $schoolClass, string $date, ?int $subjectId = null)
    {
        return Attendance::query()
            ->where('school_class_id', $schoolClass->id)
            ->where('date', $date)
            ->when($subjectId, fn($q) => $q->where('subject_id', $subjectId))
            ->whereHas('student.user')
            ->with('student.user')
            ->get();
    }

    public function studentSummary(int $studentProfileId, ?string $from = null, ?string $to = null): array
    {
        $query = Attendance::query()->where('student_profile_id', $studentProfileId);

        if ($from) {
            $query->whereDate('date', '>=', $from);
        }
        if ($to) {
            $query->whereDate('date', '<=', $to);
        }

        $records = $query->get();
        $total = $records->count();
        $present = $records->where('status.value', 'present')->count();

        return [
            'total' => $total,
            'present' => $present,
            'absent' => $records->where('status.value', 'absent')->count(),
            'late' => $records->where('status.value', 'late')->count(),
            'excused' => $records->where('status.value', 'excused')->count(),
            'attendance_rate' => $total > 0 ? round(($present / $total) * 100, 1) : null,
        ];
    }
}
