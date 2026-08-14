import { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { Search, Plus, Pencil, Trash2, ClipboardCheck } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/EmptyState';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';

const blank = { name: '', level: '', class_teacher_id: '', capacity: '' };

export default function ClassesIndex({ classes, teachers, auth }) {
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState(null);
    const isAdmin = auth.user.role === 'admin';
    const canTakeAttendance = ['admin', 'teacher'].includes(auth.user.role);
    const { data, setData, post, patch, processing, errors, reset } = useForm(blank);

    function search_(e) {
        e?.preventDefault();
        router.get(route('classes.index'), { search }, { preserveState: true });
    }

    function openCreate() {
        reset(); setData(blank); setModal({ mode: 'create' });
    }

    function openEdit(schoolClass) {
        setData({
            name: schoolClass.name, level: schoolClass.level ?? '',
            class_teacher_id: schoolClass.class_teacher_id ?? '', capacity: schoolClass.capacity ?? '',
        });
        setModal({ mode: 'edit', schoolClass });
    }

    function submit(e) {
        e.preventDefault();
        if (modal.mode === 'create') {
            post(route('classes.store'), { onSuccess: () => setModal(null) });
        } else {
            patch(route('classes.update', modal.schoolClass.id), { onSuccess: () => setModal(null) });
        }
    }

    function destroy(schoolClass) {
        if (confirm(`Delete class "${schoolClass.name}"?`)) router.delete(route('classes.destroy', schoolClass.id));
    }

    return (
        <AuthenticatedLayout header="Classes">
            <Head title="Classes" />

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <form onSubmit={search_} className="relative w-full sm:max-w-xs">
                    <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} onBlur={search_} placeholder="Search classes" className="field-input pl-9" />
                </form>
                {isAdmin && <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add class</button>}
            </div>

            {classes.data.length === 0 ? (
                <EmptyState title="No classes yet" description="Create classes like &ldquo;JSS 1A&rdquo; to start assigning students, teachers and subjects." />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {classes.data.map((c) => (
                        <div key={c.id} className="app-card register-rule">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-display text-lg font-semibold text-navy-900">{c.name}</p>
                                    <p className="text-xs text-slate-500">{c.level ?? 'No level set'}</p>
                                </div>
                                {isAdmin && (
                                    <div className="flex gap-1">
                                        <button onClick={() => openEdit(c)} className="rounded-lg p-1.5 text-slate-500 hover:bg-navy-50 hover:text-navy-900"><Pencil size={15} /></button>
                                        <button onClick={() => destroy(c)} className="rounded-lg p-1.5 text-slate-500 hover:bg-coral-50 hover:text-coral-700"><Trash2 size={15} /></button>
                                    </div>
                                )}
                            </div>
                            <div className="mt-3 flex items-center justify-between text-sm">
                                <span className="text-slate-600">{c.students_count ?? 0} students</span>
                                <span className="font-mono text-xs text-slate-500">{c.class_teacher?.user?.name ?? 'No class teacher'}</span>
                            </div>
                            {canTakeAttendance && (
                                <Link href={route('attendance.show', c.id)} className="btn-secondary mt-4 w-full">
                                    <ClipboardCheck size={16} /> Take attendance
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <Pagination meta={classes} />

            <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'create' ? 'Add class' : 'Edit class'}>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="field-label">Class name</label>
                        <input className="field-input" placeholder="e.g. JSS 1A" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        {errors.name && <p className="mt-1 text-sm text-coral-700">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="field-label">Level</label>
                        <input className="field-input" placeholder="e.g. JSS 1" value={data.level} onChange={(e) => setData('level', e.target.value)} />
                    </div>
                    <div>
                        <label className="field-label">Class teacher</label>
                        <select className="field-input" value={data.class_teacher_id} onChange={(e) => setData('class_teacher_id', e.target.value)}>
                            <option value="">None</option>
                            {teachers.map((t) => (
                                <option key={t.id} value={t.id}>{t.user.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="field-label">Capacity</label>
                        <input type="number" min="1" className="field-input" value={data.capacity} onChange={(e) => setData('capacity', e.target.value)} />
                    </div>
                    <button type="submit" disabled={processing} className="btn-primary w-full">
                        {processing ? 'Saving…' : modal?.mode === 'create' ? 'Add class' : 'Save changes'}
                    </button>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
