<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Services\SubjectService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubjectController extends Controller
{
    public function __construct(protected SubjectService $subjects) {}

    public function index(Request $request): Response
    {
        return Inertia::render('Subjects/Index', [
            'subjects' => $this->subjects->paginate($request->string('search')->value() ?: null),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Subject::class);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:20', 'unique:subjects,code'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        $this->subjects->create($data);

        return redirect()->route('subjects.index')->with('success', 'Subject added.');
    }

    public function update(Request $request, Subject $subject): RedirectResponse
    {
        $this->authorize('update', $subject);

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        $this->subjects->update($subject, $data);

        return back()->with('success', 'Subject updated.');
    }

    public function destroy(Subject $subject): RedirectResponse
    {
        $this->authorize('delete', $subject);
        $this->subjects->delete($subject);

        return redirect()->route('subjects.index')->with('success', 'Subject removed.');
    }
}
