export default function StatCard({ label, value, hint, tone = 'navy' }) {
    const toneClasses = {
        navy: 'text-navy-900',
        gold: 'text-gold-700',
        emerald: 'text-emerald-700',
        coral: 'text-coral-700',
    };

    return (
        <div className="app-card register-rule">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
            <p className={`mt-1.5 font-mono text-3xl font-semibold ${toneClasses[tone]}`}>{value}</p>
            {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
    );
}
