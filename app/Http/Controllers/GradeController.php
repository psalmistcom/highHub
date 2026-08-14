<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\SchoolClass;
use App\Services\GradeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GradeController extends Controller
{
    public function __construct(protected GradeService $grades) {}

    /** Gradebook screen: one class, one exam, one subject at a time. */
    public function show(Request $request, Exam $exam, SchoolClass $class): Response
    {
        $subjectId = $request->integer('subject_id') ?: null;

        return Inertia::render('Grades/Gradebook', [
            'exam' => $exam,
            'schoolClass' => $class->load('students.user', 'subjects'),
            'subjectId' => $subjectId,
            'existingGrades' => $subjectId
                ? \App\Models\Grade::where('exam_id', $exam->id)->where('subject_id', $subjectId)
                    ->whereIn('student_profile_id', $class->students->pluck('id'))
                    ->get(['student_profile_id', 'score'])
                : [],
        ]);
    }

    public function store(Request $request, Exam $exam): RedirectResponse
    {
        $this->authorize('create', \App\Models\Grade::class);

        $data = $request->validate([
            'subject_id' => ['required', 'exists:subjects,id'],
            'scores' => ['required', 'array', 'min:1'],
            'scores.*.student_profile_id' => ['required', 'exists:student_profiles,id'],
            'scores.*.score' => ['required', 'numeric', 'min:0', 'max:100'],
        ]);

        $this->grades->recordForExamSubject($exam, $data['subject_id'], $data['scores'], $request->user()->id);

        return back()->with('success', 'Grades saved.');
    }

    public function reportCard(Request $request, Exam $exam)
    {
        $student = $request->user()->hasRole('student')
            ? $request->user()->studentProfile
            : \App\Models\StudentProfile::findOrFail($request->integer('student_id'));

        return Inertia::render('Grades/ReportCard', $this->grades->reportCard($student, $exam));
    }
}
