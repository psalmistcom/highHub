import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <button className="absolute inset-0 bg-navy-950/50" onClick={onClose} aria-label="Close" />
            <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-card sm:rounded-2xl sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-display text-lg font-semibold text-navy-900">{title}</h3>
                    <button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-navy-50" aria-label="Close">
                        <X size={18} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
