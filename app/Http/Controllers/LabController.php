<?php

namespace App\Http\Controllers;

use App\Models\Lab;
use App\Models\SchoolClass;
use App\Services\LabService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LabController extends Controller
{
    public function __construct(protected LabService $labs) {}

    public function index(): Response
    {
        return Inertia::render('Labs/Index', [
            'labs' => Lab::with('resources', 'attendant')->get(),
            'schoolClasses' => SchoolClass::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function logUsage(Request $request, Lab $lab): RedirectResponse
    {
        $data = $request->validate([
            'lab_resource_id' => ['nullable', 'exists:lab_resources,id'],
            'school_class_id' => ['nullable', 'exists:school_classes,id'],
            'used_by' => ['nullable', 'exists:users,id'],
            'purpose' => ['nullable', 'string', 'max:255'],
            'used_at' => ['required', 'date'],
        ]);

        $this->labs->logUsage($lab, $data);

        return back()->with('success', 'Usage logged.');
    }
}
