import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/EmptyState';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';

const blank = { name: '', email: '', phone: '', subject_specialization: '', qualification: '' };

export default function TeachersIndex({ teachers, filters, auth }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [modal, setModal] = useState(null); // null | { mode: 'create' } | { mode: 'edit', teacher }
    const isAdmin = auth.user.role === 'admin';
    const { data, setData, post, patch, processing, errors, reset } = useForm(blank);

    function search_(e) {
        e?.preventDefault();
        router.get(route('teachers.index'), { search }, { preserveState: true });
    }

    function openCreate() {
        reset();
        setData(blank);
        setModal({ mode: 'create' });
    }

    function openEdit(teacher) {
        setData({
            name: teacher.user.name, email: teacher.user.email, phone: teacher.user.phone ?? '',
            subject_specialization: teacher.subject_specialization ?? '', qualification: teacher.qualification ?? '',
        });
        setModal({ mode: 'edit', teacher });
    }

    function submit(e) {
        e.preventDefault();
        if (modal.mode === 'create') {
            post(route('teachers.store'), { onSuccess: () => setModal(null) });
        } else {
            patch(route('teachers.update', modal.teacher.id), { onSuccess: () => setModal(null) });
        }
    }

    function destroy(teacher) {
        if (confirm(`Remove ${teacher.user.name}?`)) router.delete(route('teachers.destroy', teacher.id));
    }

    return (
        <AuthenticatedLayout header="Teachers">
            <Head title="Teachers" />

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <form onSubmit={search_} className="relative w-full sm:max-w-xs">
                    <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} onBlur={search_} placeholder="Search teachers" className="field-input pl-9" />
                </form>
                {isAdmin && (
                    <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add teacher</button>
                )}
            </div>

            {teachers.data.length === 0 ? (
                <EmptyState title="No teachers yet" description="Add your first teacher to start assigning classes and subjects." />
            ) : (
                <div className="app-card overflow-x-auto p-0">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-navy-100 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">Teacher</th>
                                <th className="px-4 py-3">Staff ID</th>
                                <th className="px-4 py-3">Specialization</th>
                                {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navy-100">
                            {teachers.data.map((t) => (
                                <tr key={t.id}>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-navy-900">{t.user.name}</p>
                                        <p className="text-xs text-slate-500">{t.user.email}</p>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{t.staff_id}</td>
                                    <td className="px-4 py-3 text-slate-600">{t.subject_specialization ?? '—'}</td>
                                    {isAdmin && (
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-1">
                                                <button onClick={() => openEdit(t)} className="rounded-lg p-2 text-slate-500 hover:bg-navy-50 hover:text-navy-900"><Pencil size={16} /></button>
                                                <button onClick={() => destroy(t)} className="rounded-lg p-2 text-slate-500 hover:bg-coral-50 hover:text-coral-700"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <Pagination meta={teachers} />

            <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'create' ? 'Add teacher' : 'Edit teacher'}>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="field-label">Full name</label>
                        <input className="field-input" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        {errors.name && <p className="mt-1 text-sm text-coral-700">{errors.name}</p>}
                    </div>
                    {modal?.mode === 'create' && (
                        <div>
                            <label className="field-label">Email</label>
                            <input type="email" className="field-input" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            {errors.email && <p className="mt-1 text-sm text-coral-700">{errors.email}</p>}
                        </div>
                    )}
                    <div>
                        <label className="field-label">Phone</label>
                        <input className="field-input" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                    </div>
                    <div>
                        <label className="field-label">Subject specialization</label>
                        <input className="field-input" value={data.subject_specialization} onChange={(e) => setData('subject_specialization', e.target.value)} />
                    </div>
                    <div>
                        <label className="field-label">Qualification</label>
                        <input className="field-input" value={data.qualification} onChange={(e) => setData('qualification', e.target.value)} />
                    </div>
                    <button type="submit" disabled={processing} className="btn-primary w-full">
                        {processing ? 'Saving…' : modal?.mode === 'create' ? 'Add teacher' : 'Save changes'}
                    </button>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
