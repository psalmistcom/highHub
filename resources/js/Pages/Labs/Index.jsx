import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { FlaskConical, PlusCircle } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/EmptyState';
import Modal from '@/Components/Modal';

export default function LabsIndex({ labs, schoolClasses }) {
    const [logModal, setLogModal] = useState(null); // lab being logged for
    const { data, setData, post, processing, errors, reset } = useForm({
        lab_resource_id: '', school_class_id: '', purpose: '', used_at: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('labs.usage.store', logModal.id), { onSuccess: () => { reset(); setLogModal(null); } });
    }

    return (
        <AuthenticatedLayout header="Labs">
            <Head title="Labs" />

            {labs.length === 0 ? (
                <EmptyState title="No labs yet" description="Labs (Chemistry, Physics, Computer, etc.) and their resources are managed by the admin." />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {labs.map((lab) => (
                        <div key={lab.id} className="app-card register-rule">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="flex items-center gap-2 font-display text-lg font-semibold text-navy-900">
                                        <FlaskConical size={18} className="text-gold-600" /> {lab.name}
                                    </p>
                                    <p className="text-xs text-slate-500">{lab.location ?? 'No location set'} · Attendant: {lab.attendant?.name ?? 'Unassigned'}</p>
                                </div>
                                <button onClick={() => setLogModal(lab)} className="rounded-lg p-2 text-slate-500 hover:bg-navy-50 hover:text-navy-900" aria-label="Log usage">
                                    <PlusCircle size={18} />
                                </button>
                            </div>
                            {lab.resources.length > 0 && (
                                <div className="mt-3 space-y-1.5 border-t border-navy-100 pt-3">
                                    {lab.resources.map((r) => (
                                        <div key={r.id} className="flex items-center justify-between text-sm">
                                            <span className="text-slate-600">{r.name}</span>
                                            <span className="font-mono text-xs text-slate-500">
                                                {r.quantity} · <span className="capitalize">{r.condition}</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <Modal open={!!logModal} onClose={() => setLogModal(null)} title={`Log usage - ${logModal?.name ?? ''}`}>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="field-label">Resource (optional)</label>
                        <select className="field-input" value={data.lab_resource_id} onChange={(e) => setData('lab_resource_id', e.target.value)}>
                            <option value="">General lab use</option>
                            {logModal?.resources.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="field-label">Class</label>
                        <select className="field-input" value={data.school_class_id} onChange={(e) => setData('school_class_id', e.target.value)}>
                            <option value="">—</option>
                            {schoolClasses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="field-label">Purpose</label>
                        <input className="field-input" placeholder="e.g. Titration practical" value={data.purpose} onChange={(e) => setData('purpose', e.target.value)} />
                    </div>
                    <div>
                        <label className="field-label">Date & time</label>
                        <input type="datetime-local" className="field-input" value={data.used_at} onChange={(e) => setData('used_at', e.target.value)} />
                        {errors.used_at && <p className="mt-1 text-sm text-coral-700">{errors.used_at}</p>}
                    </div>
                    <button type="submit" disabled={processing} className="btn-primary w-full">
                        {processing ? 'Logging…' : 'Log usage'}
                    </button>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
