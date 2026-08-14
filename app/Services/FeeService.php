<?php

namespace App\Services;

use App\Models\FeeStructure;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\StudentProfile;
use Illuminate\Support\Facades\DB;

class FeeService
{
    public function generateInvoicesForClass(FeeStructure $feeStructure, iterable $studentProfileIds, ?string $dueDate = null): void
    {
        DB::transaction(function () use ($feeStructure, $studentProfileIds, $dueDate) {
            foreach ($studentProfileIds as $studentId) {
                Invoice::firstOrCreate(
                    ['student_profile_id' => $studentId, 'fee_structure_id' => $feeStructure->id],
                    ['amount_due' => $feeStructure->amount, 'due_date' => $dueDate]
                );
            }
        });
    }

    public function recordPayment(Invoice $invoice, float $amount, string $method, ?string $reference, int $receivedBy): Payment
    {
        return DB::transaction(function () use ($invoice, $amount, $method, $reference, $receivedBy) {
            $payment = Payment::create([
                'invoice_id' => $invoice->id,
                'amount' => $amount,
                'method' => $method,
                'reference' => $reference,
                'received_by' => $receivedBy,
                'paid_at' => now(),
            ]);

            $invoice->increment('amount_paid', $amount);
            $invoice->refresh();
            $invoice->update([
                'status' => $invoice->amount_paid >= $invoice->amount_due ? 'paid' : ($invoice->amount_paid > 0 ? 'partial' : 'pending'),
            ]);

            return $payment;
        });
    }

    public function outstandingFor(StudentProfile $student): float
    {
        return (float) $student->invoices()->sum(DB::raw('amount_due - amount_paid'));
    }
}
