<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\SchoolClass;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExamController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Exams/Index', [
            'exams' => Exam::orderByDesc('start_date')->paginate(15),
            'schoolClasses' => SchoolClass::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Exam::class);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'term' => ['required', 'in:first,second,third'],
            'academic_year' => ['required', 'string', 'max:20'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
        ]);

        Exam::create($data);

        return redirect()->route('exams.index')->with('success', 'Exam created.');
    }
}
