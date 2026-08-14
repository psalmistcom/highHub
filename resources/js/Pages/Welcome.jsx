import { Head, Link } from "@inertiajs/react";

export default function Welcome() {
  return (
    <div className="min-h-screen bg-navy-900">
      <Head title="Welcome" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #E8A93A 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500 font-display text-2xl font-semibold text-navy-900">
          H
        </div>
        <h1 className="font-display text-4xl font-medium text-white sm:text-5xl">
          HighHub School Management
        </h1>
        <p className="mt-4 max-w-lg text-navy-100">
          Attendance, grades, fees, events and messaging — one register for
          admins, teachers, students and parents, built for the phone in
          everyone's pocket.
        </p>
        <Link href={route("login")} className="btn-primary mt-8">
          Sign in
        </Link>
      </div>
    </div>
  );
}
