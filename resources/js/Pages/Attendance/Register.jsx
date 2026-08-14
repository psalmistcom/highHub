import { useMemo, useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const STATUSES = [
  { value: "present", label: "Present", tone: "emerald" },
  { value: "absent", label: "Absent", tone: "coral" },
  { value: "late", label: "Late", tone: "gold" },
  { value: "excused", label: "Excused", tone: "navy" },
];

const TONE_CLASSES = {
  emerald: "border-emerald-300 bg-emerald-50 text-emerald-700",
  coral: "border-coral-300 bg-coral-50 text-coral-700",
  gold: "border-gold-300 bg-gold-50 text-gold-700",
  navy: "border-navy-300 bg-navy-50 text-navy-900",
};

export default function AttendanceRegister({
  schoolClass,
  date,
  subjectId,
  records,
}) {
  console.log(schoolClass.students);
  const recordMap = useMemo(() => {
    const map = {};
    records.forEach((r) => {
      map[r.student_profile_id] = r.status.value ?? r.status;
    });
    return map;
  }, [records]);

  const [form, setForm] = useState({
    date,
    subject_id: subjectId ?? "",
    statuses: Object.fromEntries(
      schoolClass.students.map((s) => [s.id, recordMap[s.id] ?? "present"]),
    ),
  });
  const [processing, setProcessing] = useState(false);

  function changeDateOrSubject(field, value) {
    const params = {
      date: form.date,
      subject_id: form.subject_id,
      ...(field ? { [field]: value } : {}),
    };
    router.get(route("attendance.show", schoolClass.id), params, {
      preserveState: false,
    });
  }

  function setStatus(studentId, status) {
    setForm((f) => ({
      ...f,
      statuses: { ...f.statuses, [studentId]: status },
    }));
  }

  function markAll(status) {
    setForm((f) => ({
      ...f,
      statuses: Object.fromEntries(
        schoolClass.students.map((s) => [s.id, status]),
      ),
    }));
  }

  function submit(e) {
    e.preventDefault();
    setProcessing(true);
    router.post(
      route("attendance.store", schoolClass.id),
      {
        date: form.date,
        subject_id: form.subject_id || null,
        entries: schoolClass.students.map((s) => ({
          student_profile_id: s.id,
          status: form.statuses[s.id],
        })),
      },
      { onFinish: () => setProcessing(false) },
    );
  }

  return (
    <AuthenticatedLayout header={`Attendance · ${schoolClass.name}`}>
      <Head title={`Attendance - ${schoolClass.name}`} />

      <div className="app-card mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <div>
            <label className="field-label">Date</label>
            <input
              type="date"
              className="field-input"
              value={form.date}
              onChange={(e) => {
                setForm((f) => ({ ...f, date: e.target.value }));
                changeDateOrSubject("date", e.target.value);
              }}
            />
          </div>
          <div>
            <label className="field-label">
              Subject (optional — whole day if blank)
            </label>
            <select
              className="field-input"
              value={form.subject_id}
              onChange={(e) => {
                setForm((f) => ({ ...f, subject_id: e.target.value }));
                changeDateOrSubject("subject_id", e.target.value);
              }}
            >
              <option value="">Whole day</option>
              {schoolClass.subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => markAll("present")}
            className="btn-secondary text-xs"
          >
            Mark all present
          </button>
        </div>
      </div>

      <form onSubmit={submit} className="app-card overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-navy-100 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {schoolClass.students.map((student) => (
              <tr key={student.id}>
                <td className="px-4 py-3 font-medium text-navy-900">
                  {student.user.name}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {STATUSES.map((s) => (
                      <button
                        type="button"
                        key={s.value}
                        onClick={() => setStatus(student.id, s.value)}
                        className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                          form.statuses[student.id] === s.value
                            ? TONE_CLASSES[s.tone]
                            : "border-navy-100 text-slate-400 hover:border-navy-300"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-navy-100 p-4">
          <button type="submit" disabled={processing} className="btn-primary">
            {processing ? "Saving…" : "Save attendance"}
          </button>
        </div>
      </form>
    </AuthenticatedLayout>
  );
}
