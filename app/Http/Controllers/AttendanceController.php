<?php

namespace App\Http\Controllers;

use App\Http\Requests\MarkAttendanceRequest;
use App\Models\SchoolClass;
use App\Services\AttendanceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function __construct(protected AttendanceService $attendance) {}

    /** Register / roll-call screen for a class on a given date. */
    public function show(Request $request, SchoolClass $class): Response
    {
        $date = $request->string('date')->value() ?: now()->toDateString();

        $class->load([
            'students' => function ($query) {
                $query->whereHas('user');
            },
            'students.user',
            'subjects'
        ]);
        return Inertia::render('Attendance/Register', [

            'schoolClass' => $class,
            'date' => $date,
            'subjectId' => $request->integer('subject_id') ?: null,
            'records' => $this->attendance->forClassOnDate($class, $date, $request->integer('subject_id') ?: null),
        ]);
    }

    public function store(MarkAttendanceRequest $request, SchoolClass $class): RedirectResponse
    {
        $this->attendance->markForClass(
            $class,
            $request->validated('date'),
            $request->validated('entries'),
            $request->validated('subject_id'),
            $request->user()->id
        );

        return back()->with('success', 'Attendance saved.');
    }
}
