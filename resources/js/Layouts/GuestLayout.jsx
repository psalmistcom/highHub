export default function GuestLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-navy-900 lg:flex-row">
      {/* Brand panel - hidden on mobile to keep the login form front and center */}
      <div className="relative hidden overflow-hidden bg-navy-900 px-12 py-16 lg:flex lg:w-1/2 lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #E8A93A 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
        <div className="relative flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500 font-display text-xl font-semibold text-navy-900">
            H
          </div>
          <span className="font-display text-2xl font-semibold text-white">
            HighHub
          </span>
        </div>
        <div className="relative">
          <p className="font-display text-4xl font-medium leading-tight text-white">
            One register.
            <br />
            Every classroom, class,
            <br />
            and child.
          </p>
          <p className="mt-4 max-w-sm text-sm text-navy-100">
            Attendance, grades, fees and school life - in one place for admins,
            teachers, students and parents.
          </p>
        </div>
        <p className="relative text-xs text-navy-300">
          HighHub School Management
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-paper px-4 py-10 sm:px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-900 font-display text-lg font-semibold text-gold-500">
              H
            </div>
            <span className="font-display text-xl font-semibold text-navy-900">
              HighHub
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
