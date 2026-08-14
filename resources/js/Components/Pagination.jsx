import { Link } from '@inertiajs/react';

export default function Pagination({ meta }) {
    if (!meta || meta.last_page <= 1) return null;

    return (
        <nav className="mt-4 flex flex-wrap items-center justify-center gap-1">
            {meta.links.map((link, i) => (
                <Link
                    key={i}
                    href={link.url || '#'}
                    preserveScroll
                    className={`min-w-[2.25rem] rounded-lg px-2.5 py-1.5 text-center text-sm ${
                        link.active
                            ? 'bg-navy-900 text-white'
                            : link.url
                              ? 'text-navy-700 hover:bg-navy-50'
                              : 'cursor-not-allowed text-slate-300'
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </nav>
    );
}
