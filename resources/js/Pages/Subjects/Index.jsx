import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/EmptyState';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';

const blank = { name: '', code: '', description: '' };

export default function SubjectsIndex({ subjects, auth }) {
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState(null);
    const isAdmin = auth.user.role === 'admin';
    const { data, setData, post, patch, processing, errors, reset } = useForm(blank);

    function search_(e) {
        e?.preventDefault();
        router.get(route('subjects.index'), { search }, { preserveState: true });
    }

    function openCreate() { reset(); setData(blank); setModal({ mode: 'create' }); }

    function openEdit(subject) {
        setData({ name: subject.name, code: subject.code, description: subject.description ?? '' });
        setModal({ mode: 'edit', subject });
    }

    function submit(e) {
        e.preventDefault();
        if (modal.mode === 'create') {
            post(route('subjects.store'), { onSuccess: () => setModal(null) });
        } else {
            patch(route('subjects.update', modal.subject.id), { onSuccess: () => setModal(null) });
        }
    }

    function destroy(subject) {
        if (confirm(`Delete subject "${subject.name}"?`)) router.delete(route('subjects.destroy', subject.id));
    }

    return (
        <AuthenticatedLayout header="Subjects">
            <Head title="Subjects" />

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <form onSubmit={search_} className="relative w-full sm:max-w-xs">
                    <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} onBlur={search_} placeholder="Search subjects" className="field-input pl-9" />
                </form>
                {isAdmin && <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add subject</button>}
            </div>

            {subjects.data.length === 0 ? (
                <EmptyState title="No subjects yet" description="Add subjects like Mathematics or English Language, then attach them to classes." />
            ) : (
                <div className="app-card overflow-x-auto p-0">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-navy-100 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">Subject</th>
                                <th className="px-4 py-3">Code</th>
                                <th className="px-4 py-3">Description</th>
                                {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navy-100">
                            {subjects.data.map((s) => (
                                <tr key={s.id}>
                                    <td className="px-4 py-3 font-medium text-navy-900">{s.name}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{s.code}</td>
                                    <td className="px-4 py-3 text-slate-600">{s.description ?? '—'}</td>
                                    {isAdmin && (
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-1">
                                                <button onClick={() => openEdit(s)} className="rounded-lg p-2 text-slate-500 hover:bg-navy-50 hover:text-navy-900"><Pencil size={16} /></button>
                                                <button onClick={() => destroy(s)} className="rounded-lg p-2 text-slate-500 hover:bg-coral-50 hover:text-coral-700"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <Pagination meta={subjects} />

            <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'create' ? 'Add subject' : 'Edit subject'}>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="field-label">Subject name</label>
                        <input className="field-input" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        {errors.name && <p className="mt-1 text-sm text-coral-700">{errors.name}</p>}
                    </div>
                    {modal?.mode === 'create' && (
                        <div>
                            <label className="field-label">Code</label>
                            <input className="field-input" placeholder="e.g. MTH" value={data.code} onChange={(e) => setData('code', e.target.value)} />
                            {errors.code && <p className="mt-1 text-sm text-coral-700">{errors.code}</p>}
                        </div>
                    )}
                    <div>
                        <label className="field-label">Description</label>
                        <input className="field-input" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                    </div>
                    <button type="submit" disabled={processing} className="btn-primary w-full">
                        {processing ? 'Saving…' : modal?.mode === 'create' ? 'Add subject' : 'Save changes'}
                    </button>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
