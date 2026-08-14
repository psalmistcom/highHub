import { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import { Plus, ClipboardList } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import EmptyState from "@/Components/EmptyState";
import Pagination from "@/Components/Pagination";
import Modal from "@/Components/Modal";

export default function ExamsIndex({ exams, schoolClasses, auth }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [pickerFor, setPickerFor] = useState(null); // exam being "enter grades"-picked
  const canManage = ["admin", "teacher"].includes(auth.user.role);
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    term: "first",
    academic_year: "",
    start_date: "",
    end_date: "",
  });

  function submit(e) {
    e.preventDefault();
    post(route("exams.store"), {
      onSuccess: () => {
        reset();
        setModalOpen(false);
      },
    });
  }

  return (
    <AuthenticatedLayout header="Exams">
      <Head title="Exams" />

      <div className="mb-4 flex justify-end">
        {canManage && (
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            <Plus size={16} /> New exam
          </button>
        )}
      </div>

      {exams.data.length === 0 ? (
        <EmptyState
          title="No exams yet"
          description="Create an exam (e.g. First Term Exam) to start entering grades per class and subject."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exams.data.map((exam) => (
            <div key={exam.id} className="app-card register-rule">
              <p className="font-display text-lg font-semibold text-navy-900">
                {exam.name}
              </p>
              <p className="text-xs capitalize text-slate-500">
                {exam.term} term · {exam.academic_year}
              </p>
              <div className="mt-4 flex flex-col gap-2">
                {canManage && (
                  <button
                    onClick={() => setPickerFor(exam)}
                    className="btn-secondary w-full text-sm"
                  >
                    <ClipboardList size={15} /> Enter grades
                  </button>
                )}
                <Link
                  href={route("grades.report-card", exam.id)}
                  className="btn-secondary w-full text-sm"
                >
                  View report card
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      <Pagination meta={exams} />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New exam"
      >
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="field-label">Exam name</label>
            <input
              className="field-input"
              placeholder="e.g. First Term Exam"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-coral-700">{errors.name}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Term</label>
              <select
                className="field-input"
                value={data.term}
                onChange={(e) => setData("term", e.target.value)}
              >
                <option value="first">First</option>
                <option value="second">Second</option>
                <option value="third">Third</option>
              </select>
            </div>
            <div>
              <label className="field-label">Academic year</label>
              <input
                className="field-input"
                placeholder="2025/2026"
                value={data.academic_year}
                onChange={(e) => setData("academic_year", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Start date</label>
              <input
                type="date"
                className="field-input"
                value={data.start_date}
                onChange={(e) => setData("start_date", e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">End date</label>
              <input
                type="date"
                className="field-input"
                value={data.end_date}
                onChange={(e) => setData("end_date", e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={processing}
            className="btn-primary w-full"
          >
            {processing ? "Creating…" : "Create exam"}
          </button>
        </form>
      </Modal>

      <Modal
        open={!!pickerFor}
        onClose={() => setPickerFor(null)}
        title="Choose a class"
      >
        <div className="space-y-1.5">
          {/* {schoolClasses.map((c) => (
                        <Link
                            key={c.id}
                            href={route('grades.show', [pickerFor?.id, c.id])}
                            className="block rounded-xl border border-navy-100 px-4 py-2.5 text-sm font-medium text-navy-900 hover:border-navy-300 hover:bg-navy-50"
                        >
                            {c.name}
                        </Link>
                    ))} */}
        </div>
      </Modal>
    </AuthenticatedLayout>
  );
}
