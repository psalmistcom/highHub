<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\SchoolClass;
use App\Models\StudentProfile;
use App\Services\StudentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function __construct(protected StudentService $students) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', StudentProfile::class);

        return Inertia::render('Students/Index', [
            'students' => $this->students->paginate(
                $request->string('search')->value() ?: null,
                $request->integer('school_class_id') ?: null
            ),
            'schoolClasses' => SchoolClass::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['search', 'school_class_id']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', StudentProfile::class);

        return Inertia::render('Students/Create', [
            'schoolClasses' => SchoolClass::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreStudentRequest $request): RedirectResponse
    {
        $this->students->create($request->validated());

        return redirect()->route('students.index')->with('success', 'Student enrolled successfully.');
    }

    public function edit(StudentProfile $student): Response
    {
        $this->authorize('update', $student);

        return Inertia::render('Students/Edit', [
            'student' => $student->load('user', 'schoolClass'),
            'schoolClasses' => SchoolClass::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateStudentRequest $request, StudentProfile $student): RedirectResponse
    {
        $this->students->update($student, $request->validated());

        return redirect()->route('students.index')->with('success', 'Student updated.');
    }

    public function destroy(StudentProfile $student): RedirectResponse
    {
        $this->authorize('delete', $student);
        $this->students->delete($student);

        return redirect()->route('students.index')->with('success', 'Student removed.');
    }
}
