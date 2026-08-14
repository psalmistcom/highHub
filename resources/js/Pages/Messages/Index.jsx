import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Inbox, Send } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/EmptyState';
import Modal from '@/Components/Modal';

export default function MessagesIndex({ inbox, sent, contacts }) {
    const [tab, setTab] = useState('inbox');
    const [composeOpen, setComposeOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        receiver_id: '', subject: '', body: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('messages.store'), { onSuccess: () => { reset(); setComposeOpen(false); } });
    }

    function open(message) {
        if (tab === 'inbox' && !message.read_at) router.patch(route('messages.read', message.id), {}, { preserveScroll: true });
    }

    const list = tab === 'inbox' ? inbox : sent;

    return (
        <AuthenticatedLayout header="Messages">
            <Head title="Messages" />

            <div className="mb-4 flex items-center justify-between">
                <div className="inline-flex rounded-xl border border-navy-100 bg-white p-1">
                    <button
                        onClick={() => setTab('inbox')}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ${tab === 'inbox' ? 'bg-navy-900 text-white' : 'text-slate-600'}`}
                    >
                        <Inbox size={14} /> Inbox
                    </button>
                    <button
                        onClick={() => setTab('sent')}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ${tab === 'sent' ? 'bg-navy-900 text-white' : 'text-slate-600'}`}
                    >
                        <Send size={14} /> Sent
                    </button>
                </div>
                <button onClick={() => setComposeOpen(true)} className="btn-primary"><Plus size={16} /> Compose</button>
            </div>

            {list.length === 0 ? (
                <EmptyState title={tab === 'inbox' ? 'No messages yet' : 'Nothing sent yet'} description="Messages between admins, teachers, students and parents show up here." />
            ) : (
                <div className="app-card divide-y divide-navy-100 p-0">
                    {list.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => open(m)}
                            className="flex w-full flex-col gap-1 px-4 py-3 text-left hover:bg-navy-50"
                        >
                            <div className="flex items-center justify-between">
                                <p className={`font-medium ${tab === 'inbox' && !m.read_at ? 'text-navy-900' : 'text-slate-700'}`}>
                                    {tab === 'inbox' ? m.sender.name : m.receiver.name}
                                </p>
                                <p className="font-mono text-xs text-slate-400">
                                    {new Date(m.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </p>
                            </div>
                            {m.subject && <p className="text-sm font-medium text-slate-600">{m.subject}</p>}
                            <p className="truncate text-sm text-slate-500">{m.body}</p>
                        </button>
                    ))}
                </div>
            )}

            <Modal open={composeOpen} onClose={() => setComposeOpen(false)} title="Compose message">
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="field-label">To</label>
                        <select className="field-input" value={data.receiver_id} onChange={(e) => setData('receiver_id', e.target.value)}>
                            <option value="">Select recipient</option>
                            {contacts.map((c) => (
                                <option key={c.id} value={c.id}>{c.name} · {c.role.replace('_', ' ')}</option>
                            ))}
                        </select>
                        {errors.receiver_id && <p className="mt-1 text-sm text-coral-700">{errors.receiver_id}</p>}
                    </div>
                    <div>
                        <label className="field-label">Subject (optional)</label>
                        <input className="field-input" value={data.subject} onChange={(e) => setData('subject', e.target.value)} />
                    </div>
                    <div>
                        <label className="field-label">Message</label>
                        <textarea rows={4} className="field-input" value={data.body} onChange={(e) => setData('body', e.target.value)} />
                        {errors.body && <p className="mt-1 text-sm text-coral-700">{errors.body}</p>}
                    </div>
                    <button type="submit" disabled={processing} className="btn-primary w-full">
                        {processing ? 'Sending…' : 'Send message'}
                    </button>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
