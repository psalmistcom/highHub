<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use App\Models\TeacherProfile;
use App\Services\SchoolClassService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SchoolClassController extends Controller
{
    public function __construct(protected SchoolClassService $classes) {}

    public function index(Request $request): Response
    {
        return Inertia::render('Classes/Index', [
            'classes' => $this->classes->paginate($request->string('search')->value() ?: null),
            'teachers' => TeacherProfile::whereHas('user')->with('user')->get(['id', 'user_id']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', SchoolClass::class);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'level' => ['nullable', 'string', 'max:255'],
            'class_teacher_id' => ['nullable', 'exists:teacher_profiles,id'],
            'capacity' => ['nullable', 'integer', 'min:1'],
        ]);

        $this->classes->create($data);

        return redirect()->route('classes.index')->with('success', 'Class created.');
    }

    public function update(Request $request, SchoolClass $class): RedirectResponse
    {
        $this->authorize('update', $class);

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'level' => ['nullable', 'string', 'max:255'],
            'class_teacher_id' => ['nullable', 'exists:teacher_profiles,id'],
            'capacity' => ['nullable', 'integer', 'min:1'],
        ]);

        $this->classes->update($class, $data);

        return back()->with('success', 'Class updated.');
    }

    public function destroy(SchoolClass $class): RedirectResponse
    {
        $this->authorize('delete', $class);
        $this->classes->delete($class);

        return redirect()->route('classes.index')->with('success', 'Class removed.');
    }
}
