<?php

namespace App\Http\Controllers;

use App\Models\TeacherProfile;
use App\Services\TeacherService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeacherController extends Controller
{
    public function __construct(protected TeacherService $teachers) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', TeacherProfile::class);

        return Inertia::render('Teachers/Index', [
            'teachers' => $this->teachers->paginate($request->string('search')->value() ?: null),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', TeacherProfile::class);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:30'],
            'subject_specialization' => ['nullable', 'string', 'max:255'],
            'qualification' => ['nullable', 'string', 'max:255'],
        ]);

        $this->teachers->create($data);

        return redirect()->route('teachers.index')->with('success', 'Teacher added.');
    }

    public function update(Request $request, TeacherProfile $teacher): RedirectResponse
    {
        $this->authorize('update', $teacher);

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'subject_specialization' => ['nullable', 'string', 'max:255'],
            'qualification' => ['nullable', 'string', 'max:255'],
        ]);

        $this->teachers->update($teacher, $data);

        return back()->with('success', 'Teacher updated.');
    }

    public function destroy(TeacherProfile $teacher): RedirectResponse
    {
        $this->authorize('delete', $teacher);
        $this->teachers->delete($teacher);

        return redirect()->route('teachers.index')->with('success', 'Teacher removed.');
    }
}
