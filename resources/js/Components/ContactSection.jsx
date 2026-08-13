import { useForm, usePage } from '@inertiajs/react';

export default function ContactSection({ contact }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/contact-us', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    }

    return (
        <section id="contact" className="bg-bark text-chalk">
            <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
                <div>
                    <p className="font-mono text-xs uppercase tracking-widest2 text-heartwood-400">
                        Get In Touch
                    </p>
                    <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                        {contact.title}
                    </h2>
                    <address className="mt-6 space-y-1 text-sm not-italic leading-relaxed text-chalk/70">
                        {contact.address.map((line) => (
                            <p key={line}>{line}</p>
                        ))}
                    </address>
                    <div className="mt-5 space-y-1 text-sm">
                        <p>
                            <a href={`mailto:${contact.email}`} className="focus-ring text-heartwood-300 hover:text-chalk">
                                {contact.email}
                            </a>
                        </p>
                        <p>
                            <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="focus-ring text-heartwood-300 hover:text-chalk">
                                {contact.phone}
                            </a>
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="rounded-sm bg-bark-light p-7 sm:p-8" noValidate>
                    {flash?.success && (
                        <p className="mb-5 rounded-sm bg-sap/40 px-4 py-3 text-sm text-chalk">
                            {flash.success}
                        </p>
                    )}
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Field
                            label="Name"
                            value={data.name}
                            onChange={(v) => setData('name', v)}
                            error={errors.name}
                            required
                        />
                        <Field
                            label="Email"
                            type="email"
                            value={data.email}
                            onChange={(v) => setData('email', v)}
                            error={errors.email}
                            required
                        />
                        <Field
                            label="Phone"
                            value={data.phone}
                            onChange={(v) => setData('phone', v)}
                            error={errors.phone}
                        />
                        <Field
                            label="Company"
                            value={data.company}
                            onChange={(v) => setData('company', v)}
                            error={errors.company}
                        />
                    </div>
                    <div className="mt-5">
                        <label className="block text-xs font-medium uppercase tracking-wide text-chalk/60">
                            Message
                        </label>
                        <textarea
                            rows={4}
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            className="focus-ring mt-2 w-full rounded-sm border border-chalk/20 bg-transparent px-3 py-2.5 text-sm text-chalk placeholder:text-chalk/30"
                            placeholder="Tell us about your project"
                        />
                        {errors.message && <p className="mt-1 text-xs text-rust">{errors.message}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="focus-ring mt-6 w-full rounded-sm bg-rust px-6 py-3 text-sm font-semibold text-chalk hover:bg-rust/90 disabled:opacity-60 sm:w-auto"
                    >
                        {processing ? 'Sending…' : 'Submit'}
                    </button>
                </form>
            </div>
        </section>
    );
}

function Field({ label, value, onChange, error, type = 'text', required = false }) {
    return (
        <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-chalk/60">
                {label}
                {required && <span className="text-rust"> *</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="focus-ring mt-2 w-full rounded-sm border border-chalk/20 bg-transparent px-3 py-2.5 text-sm text-chalk placeholder:text-chalk/30"
            />
            {error && <p className="mt-1 text-xs text-rust">{error}</p>}
        </div>
    );
}
