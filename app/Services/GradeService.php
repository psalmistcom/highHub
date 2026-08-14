<?php

namespace App\Services;

use App\Models\Exam;
use App\Models\Grade;
use App\Models\StudentProfile;
use Illuminate\Support\Facades\DB;

class GradeService
{
    /** $scores = [['student_profile_id' => 1, 'score' => 78, 'remark' => null], ...] */
    public function recordForExamSubject(Exam $exam, int $subjectId, array $scores, int $gradedBy): void
    {
        DB::transaction(function () use ($exam, $subjectId, $scores, $gradedBy) {
            foreach ($scores as $entry) {
                Grade::updateOrCreate(
                    [
                        'student_profile_id' => $entry['student_profile_id'],
                        'exam_id' => $exam->id,
                        'subject_id' => $subjectId,
                    ],
                    [
                        'score' => $entry['score'],
                        'remark' => $entry['remark'] ?? $this->remarkFor((float) $entry['score']),
                        'graded_by' => $gradedBy,
                    ]
                );
            }
        });
    }

    public function reportCard(StudentProfile $student, Exam $exam): array
    {
        $grades = Grade::with('subject')
            ->where('student_profile_id', $student->id)
            ->where('exam_id', $exam->id)
            ->get();

        return [
            'student' => $student->load('user', 'schoolClass'),
            'exam' => $exam,
            'grades' => $grades,
            'average' => $grades->count() ? round($grades->avg('score'), 2) : null,
        ];
    }

    protected function remarkFor(float $score): string
    {
        return match (true) {
            $score >= 75 => 'Excellent',
            $score >= 60 => 'Good',
            $score >= 50 => 'Fair',
            default => 'Needs Improvement',
        };
    }
}
