import { useForm, Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function submit(e) {
        e.preventDefault();
        post(route('login'));
    }

    return (
        <GuestLayout>
            <Head title="Log in" />
            <h2 className="font-display text-2xl font-semibold text-navy-900">Welcome back</h2>
            <p className="mt-1 text-sm text-slate-500">
                Sign in with the registration ID / email your school admin gave you.
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4">
                <div>
                    <label htmlFor="email" className="field-label">Email</label>
                    <input
                        id="email"
                        type="email"
                        autoFocus
                        autoComplete="username"
                        className="field-input"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && <p className="mt-1 text-sm text-coral-700">{errors.email}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="field-label">Password</label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        className="field-input"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                    />
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                        type="checkbox"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                        className="rounded border-navy-100 text-navy-900 focus:ring-navy-300"
                    />
                    Remember me
                </label>

                <button type="submit" disabled={processing} className="btn-primary w-full">
                    {processing ? 'Signing in…' : 'Sign in'}
                </button>
            </form>
        </GuestLayout>
    );
}
