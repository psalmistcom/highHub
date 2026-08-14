import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/EmptyState';
import Pagination from '@/Components/Pagination';

export default function StudentsIndex({ students, schoolClasses, filters, auth }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const isAdmin = auth.user.role === 'admin';

    function applyFilters(e) {
        e?.preventDefault();
        router.get(route('students.index'), { search, school_class_id: filters.school_class_id }, { preserveState: true });
    }

    function destroy(student) {
        if (confirm(`Remove ${student.user.name} from HighHub? This can't be undone.`)) {
            router.delete(route('students.destroy', student.id));
        }
    }

    return (
        <AuthenticatedLayout header="Students">
            <Head title="Students" />

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <form onSubmit={applyFilters} className="relative w-full sm:max-w-xs">
                    <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onBlur={applyFilters}
                        placeholder="Search by name, email or admission no."
                        className="field-input pl-9"
                    />
                </form>
                {isAdmin && (
                    <Link href={route('students.create')} className="btn-primary">
                        <Plus size={16} /> Enroll student
                    </Link>
                )}
            </div>

            {students.data.length === 0 ? (
                <EmptyState
                    title="No students yet"
                    description="Enroll your first student to start tracking attendance, grades and fees."
                    action={isAdmin && <Link href={route('students.create')} className="btn-primary">Enroll student</Link>}
                />
            ) : (
                <div className="app-card overflow-x-auto p-0">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-navy-100 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">Student</th>
                                <th className="px-4 py-3">Admission No.</th>
                                <th className="px-4 py-3">Class</th>
                                {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navy-100">
                            {students.data.map((student) => (
                                <tr key={student.id}>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-navy-900">{student.user.name}</p>
                                        <p className="text-xs text-slate-500">{student.user.email}</p>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{student.admission_no}</td>
                                    <td className="px-4 py-3 text-slate-600">{student.school_class?.name ?? '—'}</td>
                                    {isAdmin && (
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-1">
                                                <Link
                                                    href={route('students.edit', student.id)}
                                                    className="rounded-lg p-2 text-slate-500 hover:bg-navy-50 hover:text-navy-900"
                                                    aria-label="Edit"
                                                >
                                                    <Pencil size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => destroy(student)}
                                                    className="rounded-lg p-2 text-slate-500 hover:bg-coral-50 hover:text-coral-700"
                                                    aria-label="Remove"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination meta={students} />
        </AuthenticatedLayout>
    );
}
