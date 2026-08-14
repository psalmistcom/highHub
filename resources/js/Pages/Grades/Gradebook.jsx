import { useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Gradebook({ exam, schoolClass, subjectId, existingGrades }) {
    const gradeMap = useMemo(() => {
        const map = {};
        existingGrades.forEach((g) => { map[g.student_profile_id] = g.score; });
        return map;
    }, [existingGrades]);

    const [subject, setSubject] = useState(subjectId ?? schoolClass.subjects[0]?.id ?? '');
    const [scores, setScores] = useState(
        Object.fromEntries(schoolClass.students.map((s) => [s.id, gradeMap[s.id] ?? '']))
    );
    const [processing, setProcessing] = useState(false);

    function changeSubject(id) {
        setSubject(id);
        router.get(route('grades.show', [exam.id, schoolClass.id]), { subject_id: id }, { preserveState: false });
    }

    function submit(e) {
        e.preventDefault();
        setProcessing(true);
        router.post(
            route('grades.store', exam.id),
            {
                subject_id: subject,
                scores: schoolClass.students
                    .filter((s) => scores[s.id] !== '')
                    .map((s) => ({ student_profile_id: s.id, score: scores[s.id] })),
            },
            { onFinish: () => setProcessing(false) }
        );
    }

    return (
        <AuthenticatedLayout header={`Gradebook · ${exam.name} · ${schoolClass.name}`}>
            <Head title={`Gradebook - ${schoolClass.name}`} />

            <div className="app-card mb-4 max-w-xs">
                <label className="field-label">Subject</label>
                <select className="field-input" value={subject} onChange={(e) => changeSubject(e.target.value)}>
                    {schoolClass.subjects.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
            </div>

            <form onSubmit={submit} className="app-card overflow-x-auto p-0">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-navy-100 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-4 py-3">Student</th>
                            <th className="px-4 py-3">Score (/100)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-100">
                        {schoolClass.students.map((student) => (
                            <tr key={student.id}>
                                <td className="px-4 py-3 font-medium text-navy-900">{student.user.name}</td>
                                <td className="px-4 py-3">
                                    <input
                                        type="number" min="0" max="100" step="0.5"
                                        className="field-input max-w-[7rem] font-mono"
                                        value={scores[student.id]}
                                        onChange={(e) => setScores((s) => ({ ...s, [student.id]: e.target.value }))}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="border-t border-navy-100 p-4">
                    <button type="submit" disabled={processing || !subject} className="btn-primary">
                        {processing ? 'Saving…' : 'Save grades'}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
