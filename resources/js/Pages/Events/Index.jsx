import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/EmptyState';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';

const blank = { title: '', description: '', event_date: '', location: '' };

export default function EventsIndex({ events, auth }) {
    const [modal, setModal] = useState(null);
    const isAdmin = auth.user.role === 'admin';
    const { data, setData, post, patch, processing, errors, reset } = useForm(blank);

    function openCreate() { reset(); setData(blank); setModal({ mode: 'create' }); }

    function openEdit(event) {
        setData({
            title: event.title, description: event.description ?? '',
            event_date: event.event_date?.slice(0, 16) ?? '', location: event.location ?? '',
        });
        setModal({ mode: 'edit', event });
    }

    function submit(e) {
        e.preventDefault();
        if (modal.mode === 'create') {
            post(route('events.store'), { onSuccess: () => setModal(null) });
        } else {
            patch(route('events.update', modal.event.id), { onSuccess: () => setModal(null) });
        }
    }

    function destroy(event) {
        if (confirm(`Remove "${event.title}"?`)) router.delete(route('events.destroy', event.id));
    }

    return (
        <AuthenticatedLayout header="Events">
            <Head title="Events" />

            <div className="mb-4 flex justify-end">
                {isAdmin && <button onClick={openCreate} className="btn-primary"><Plus size={16} /> New event</button>}
            </div>

            {events.data.length === 0 ? (
                <EmptyState title="No events yet" description="Publish school events like parent-teacher meetings or sports day - everyone will see them here." />
            ) : (
                <div className="space-y-3">
                    {events.data.map((event) => (
                        <div key={event.id} className="app-card register-rule flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                                <p className="font-display text-lg font-semibold text-navy-900">{event.title}</p>
                                {event.description && <p className="mt-1 text-sm text-slate-600">{event.description}</p>}
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                    <span className="font-mono">
                                        {new Date(event.event_date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                    </span>
                                    {event.location && (
                                        <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
                                    )}
                                </div>
                            </div>
                            {isAdmin && (
                                <div className="flex gap-1">
                                    <button onClick={() => openEdit(event)} className="rounded-lg p-2 text-slate-500 hover:bg-navy-50 hover:text-navy-900"><Pencil size={16} /></button>
                                    <button onClick={() => destroy(event)} className="rounded-lg p-2 text-slate-500 hover:bg-coral-50 hover:text-coral-700"><Trash2 size={16} /></button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <Pagination meta={events} />

            <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'create' ? 'New event' : 'Edit event'}>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="field-label">Title</label>
                        <input className="field-input" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                        {errors.title && <p className="mt-1 text-sm text-coral-700">{errors.title}</p>}
                    </div>
                    <div>
                        <label className="field-label">Description</label>
                        <textarea rows={3} className="field-input" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                    </div>
                    <div>
                        <label className="field-label">Date & time</label>
                        <input type="datetime-local" className="field-input" value={data.event_date} onChange={(e) => setData('event_date', e.target.value)} />
                        {errors.event_date && <p className="mt-1 text-sm text-coral-700">{errors.event_date}</p>}
                    </div>
                    <div>
                        <label className="field-label">Location</label>
                        <input className="field-input" value={data.location} onChange={(e) => setData('location', e.target.value)} />
                    </div>
                    <button type="submit" disabled={processing} className="btn-primary w-full">
                        {processing ? 'Saving…' : modal?.mode === 'create' ? 'Publish event' : 'Save changes'}
                    </button>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
