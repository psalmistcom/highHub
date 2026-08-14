import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Wallet } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/EmptyState';
import Badge from '@/Components/Badge';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';

export default function FeesIndex({ feeStructures, invoices, schoolClasses, auth }) {
    const [structureModal, setStructureModal] = useState(false);
    const [payModal, setPayModal] = useState(null); // invoice being paid
    const canManage = ['admin', 'bursar'].includes(auth.user.role);

    const structureForm = useForm({
        name: '', school_class_id: '', amount: '', term: 'first', academic_year: '', generate_invoices: true,
    });
    const payForm = useForm({ amount: '', method: 'cash', reference: '' });

    function submitStructure(e) {
        e.preventDefault();
        structureForm.post(route('fees.structures.store'), { onSuccess: () => { structureForm.reset(); setStructureModal(false); } });
    }

    function submitPay(e) {
        e.preventDefault();
        payForm.post(route('invoices.pay', payModal.id), { onSuccess: () => { payForm.reset(); setPayModal(null); } });
    }

    return (
        <AuthenticatedLayout header="Fees">
            <Head title="Fees" />

            <div className="mb-8">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="register-rule font-display text-lg font-semibold text-navy-900">Fee structures</h2>
                    {canManage && <button onClick={() => setStructureModal(true)} className="btn-secondary text-sm"><Plus size={15} /> New structure</button>}
                </div>
                {feeStructures.data.length === 0 ? (
                    <EmptyState title="No fee structures yet" description="Create one per class and term - HighHub can auto-generate invoices for every student in that class." />
                ) : (
                    <div className="app-card overflow-x-auto p-0">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-navy-100 text-xs uppercase tracking-wide text-slate-500">
                                <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Term</th></tr>
                            </thead>
                            <tbody className="divide-y divide-navy-100">
                                {feeStructures.data.map((f) => (
                                    <tr key={f.id}>
                                        <td className="px-4 py-3 font-medium text-navy-900">{f.name}</td>
                                        <td className="px-4 py-3 text-slate-600">{f.school_class?.name ?? 'All classes'}</td>
                                        <td className="px-4 py-3 font-mono text-slate-700">₦{Number(f.amount).toLocaleString()}</td>
                                        <td className="px-4 py-3 capitalize text-slate-600">{f.term} · {f.academic_year}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <Pagination meta={feeStructures} />
            </div>

            <div>
                <h2 className="register-rule mb-3 font-display text-lg font-semibold text-navy-900">Invoices</h2>
                {invoices.data.length === 0 ? (
                    <EmptyState title="No invoices yet" description="Invoices appear once a fee structure is applied to a class." />
                ) : (
                    <div className="app-card overflow-x-auto p-0">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-navy-100 text-xs uppercase tracking-wide text-slate-500">
                                <tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Fee</th><th className="px-4 py-3">Balance</th><th className="px-4 py-3">Status</th>{canManage && <th className="px-4 py-3 text-right">Action</th>}</tr>
                            </thead>
                            <tbody className="divide-y divide-navy-100">
                                {invoices.data.map((inv) => (
                                    <tr key={inv.id}>
                                        <td className="px-4 py-3 font-medium text-navy-900">{inv.student.user.name}</td>
                                        <td className="px-4 py-3 text-slate-600">{inv.fee_structure.name}</td>
                                        <td className="px-4 py-3 font-mono text-slate-700">₦{(Number(inv.amount_due) - Number(inv.amount_paid)).toLocaleString()}</td>
                                        <td className="px-4 py-3"><Badge status={inv.status}>{inv.status}</Badge></td>
                                        {canManage && (
                                            <td className="px-4 py-3 text-right">
                                                {inv.status !== 'paid' && (
                                                    <button onClick={() => setPayModal(inv)} className="rounded-lg p-2 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"><Wallet size={16} /></button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <Pagination meta={invoices} />
            </div>

            <Modal open={structureModal} onClose={() => setStructureModal(false)} title="New fee structure">
                <form onSubmit={submitStructure} className="space-y-4">
                    <div>
                        <label className="field-label">Name</label>
                        <input className="field-input" placeholder="e.g. JSS1 Tuition - First Term" value={structureForm.data.name} onChange={(e) => structureForm.setData('name', e.target.value)} />
                    </div>
                    <div>
                        <label className="field-label">Class</label>
                        <select className="field-input" value={structureForm.data.school_class_id} onChange={(e) => structureForm.setData('school_class_id', e.target.value)}>
                            <option value="">All classes</option>
                            {schoolClasses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="field-label">Amount (₦)</label>
                            <input type="number" min="0" className="field-input" value={structureForm.data.amount} onChange={(e) => structureForm.setData('amount', e.target.value)} />
                        </div>
                        <div>
                            <label className="field-label">Term</label>
                            <select className="field-input" value={structureForm.data.term} onChange={(e) => structureForm.setData('term', e.target.value)}>
                                <option value="first">First</option><option value="second">Second</option><option value="third">Third</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="field-label">Academic year</label>
                        <input className="field-input" placeholder="2025/2026" value={structureForm.data.academic_year} onChange={(e) => structureForm.setData('academic_year', e.target.value)} />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                        <input type="checkbox" checked={structureForm.data.generate_invoices} onChange={(e) => structureForm.setData('generate_invoices', e.target.checked)} className="rounded border-navy-100" />
                        Generate invoices for every student in this class now
                    </label>
                    <button type="submit" disabled={structureForm.processing} className="btn-primary w-full">
                        {structureForm.processing ? 'Saving…' : 'Create fee structure'}
                    </button>
                </form>
            </Modal>

            <Modal open={!!payModal} onClose={() => setPayModal(null)} title={`Record payment - ${payModal?.student?.user?.name ?? ''}`}>
                <form onSubmit={submitPay} className="space-y-4">
                    <div>
                        <label className="field-label">Amount (₦)</label>
                        <input type="number" min="0.01" step="0.01" className="field-input" value={payForm.data.amount} onChange={(e) => payForm.setData('amount', e.target.value)} />
                    </div>
                    <div>
                        <label className="field-label">Method</label>
                        <select className="field-input" value={payForm.data.method} onChange={(e) => payForm.setData('method', e.target.value)}>
                            <option value="cash">Cash</option><option value="transfer">Transfer</option><option value="card">Card</option>
                        </select>
                    </div>
                    <div>
                        <label className="field-label">Reference (optional)</label>
                        <input className="field-input" value={payForm.data.reference} onChange={(e) => payForm.setData('reference', e.target.value)} />
                    </div>
                    <button type="submit" disabled={payForm.processing} className="btn-primary w-full">
                        {payForm.processing ? 'Recording…' : 'Record payment'}
                    </button>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
