import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function StudentsCreate({ schoolClasses }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', phone: '', password: '',
        school_class_id: '', gender: '', date_of_birth: '', address: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('students.store'));
    }

    return (
        <AuthenticatedLayout header="Enroll student">
            <Head title="Enroll student" />

            <form onSubmit={submit} className="app-card max-w-2xl space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="field-label">Full name</label>
                        <input className="field-input" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        {errors.name && <p className="mt-1 text-sm text-coral-700">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="field-label">Email</label>
                        <input type="email" className="field-input" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                        {errors.email && <p className="mt-1 text-sm text-coral-700">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="field-label">Phone</label>
                        <input className="field-input" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                    </div>
                    <div>
                        <label className="field-label">Temporary password</label>
                        <input type="text" className="field-input" placeholder="Leave blank to auto-generate" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                    </div>
                    <div>
                        <label className="field-label">Class</label>
                        <select className="field-input" value={data.school_class_id} onChange={(e) => setData('school_class_id', e.target.value)}>
                            <option value="">Unassigned</option>
                            {schoolClasses.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="field-label">Gender</label>
                        <select className="field-input" value={data.gender} onChange={(e) => setData('gender', e.target.value)}>
                            <option value="">—</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label className="field-label">Date of birth</label>
                        <input type="date" className="field-input" value={data.date_of_birth} onChange={(e) => setData('date_of_birth', e.target.value)} />
                    </div>
                    <div>
                        <label className="field-label">Address</label>
                        <input className="field-input" value={data.address} onChange={(e) => setData('address', e.target.value)} />
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <button type="submit" disabled={processing} className="btn-primary">
                        {processing ? 'Saving…' : 'Enroll student'}
                    </button>
                    <Link href={route('students.index')} className="btn-secondary">Cancel</Link>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
