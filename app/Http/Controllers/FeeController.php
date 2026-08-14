<?php

namespace App\Http\Controllers;

use App\Models\FeeStructure;
use App\Models\Invoice;
use App\Models\SchoolClass;
use App\Services\FeeService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FeeController extends Controller
{
    public function __construct(protected FeeService $fees) {}

    public function index(): Response
    {
        $invoices = Invoice::query()
            ->whereHas('student.user')
            ->with('student.user', 'feeStructure')->latest()->paginate(15, ['*'], 'invoices_page');
        return Inertia::render('Fees/Index', [
            'feeStructures' => FeeStructure::with('schoolClass')->latest()->paginate(15),
            'invoices' => $invoices,
            'schoolClasses' => SchoolClass::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function storeStructure(\Illuminate\Http\Request $request): RedirectResponse
    {
        $this->authorize('create', FeeStructure::class);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'school_class_id' => ['nullable', 'exists:school_classes,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'term' => ['required', 'in:first,second,third'],
            'academic_year' => ['required', 'string', 'max:20'],
        ]);

        $structure = FeeStructure::create($data);

        if ($request->boolean('generate_invoices') && $structure->school_class_id) {
            $studentIds = \App\Models\StudentProfile::where('school_class_id', $structure->school_class_id)->pluck('id');
            $this->fees->generateInvoicesForClass($structure, $studentIds);
        }

        return back()->with('success', 'Fee structure created.');
    }

    public function pay(\Illuminate\Http\Request $request, Invoice $invoice): RedirectResponse
    {
        $this->authorize('update', $invoice);

        $data = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01'],
            'method' => ['required', 'in:cash,transfer,card'],
            'reference' => ['nullable', 'string', 'max:255'],
        ]);

        $this->fees->recordPayment($invoice, $data['amount'], $data['method'], $data['reference'] ?? null, $request->user()->id);

        return back()->with('success', 'Payment recorded.');
    }
}
