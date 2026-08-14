export default function EmptyState({ title, description, action }) {
    return (
        <div className="app-card flex flex-col items-center justify-center gap-2 border-dashed py-12 text-center">
            <p className="font-display text-lg font-semibold text-navy-900">{title}</p>
            {description && <p className="max-w-sm text-sm text-slate-500">{description}</p>}
            {action}
        </div>
    );
}
