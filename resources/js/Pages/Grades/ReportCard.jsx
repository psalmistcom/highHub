import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Badge from '@/Components/Badge';
import EmptyState from '@/Components/EmptyState';

const REMARK_TONE = {
    Excellent: 'active', Good: 'active', Fair: 'late', 'Needs Improvement': 'inactive',
};

export default function ReportCard({ student, exam, grades, average }) {
    return (
        <AuthenticatedLayout header="Report card">
            <Head title={`Report card - ${student.user.name}`} />

            <div className="app-card mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                    <p className="font-display text-xl font-semibold text-navy-900">{student.user.name}</p>
                    <p className="text-sm text-slate-500">{student.school_class?.name ?? 'Unassigned class'} · {student.admission_no}</p>
                </div>
                <div className="text-left sm:text-right">
                    <p className="text-xs uppercase tracking-wide text-slate-500">{exam.name}</p>
                    <p className="font-mono text-2xl font-semibold text-navy-900">{average ?? '—'}<span className="text-sm text-slate-400">/100 avg</span></p>
                </div>
            </div>

            {grades.length === 0 ? (
                <EmptyState title="No grades recorded yet" description="Once a teacher enters scores for this exam, they'll show up here." />
            ) : (
                <div className="app-card overflow-x-auto p-0">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-navy-100 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">Subject</th>
                                <th className="px-4 py-3">Score</th>
                                <th className="px-4 py-3">Remark</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navy-100">
                            {grades.map((g) => (
                                <tr key={g.id}>
                                    <td className="px-4 py-3 font-medium text-navy-900">{g.subject.name}</td>
                                    <td className="px-4 py-3 font-mono text-slate-700">{g.score}</td>
                                    <td className="px-4 py-3">
                                        <Badge status={REMARK_TONE[g.remark] ?? 'late'}>{g.remark}</Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
