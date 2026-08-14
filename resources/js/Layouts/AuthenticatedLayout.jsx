import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  CalendarDays,
  MessageSquare,
  Wallet,
  FlaskConical,
  Menu,
  X,
  LogOut,
} from "lucide-react";

/** Nav items per role - single source of truth for both the desktop sidebar
 *  and the mobile bottom tab bar, so the two never drift apart. */
const NAV_BY_ROLE = {
  admin: [
    { label: "Dashboard", href: "dashboard", icon: LayoutDashboard },
    { label: "Students", href: "students.index", icon: GraduationCap },
    { label: "Teachers", href: "teachers.index", icon: Users },
    { label: "Classes", href: "classes.index", icon: BookOpen },
    { label: "Exams", href: "exams.index", icon: ClipboardList },
    { label: "Subjects", href: "subjects.index", icon: ClipboardList },
    { label: "Fees", href: "fees.index", icon: Wallet },
    { label: "Events", href: "events.index", icon: CalendarDays },
    { label: "Messages", href: "messages.index", icon: MessageSquare },
  ],
  teacher: [
    { label: "Dashboard", href: "dashboard", icon: LayoutDashboard },
    { label: "Students", href: "students.index", icon: GraduationCap },
    { label: "Classes", href: "classes.index", icon: BookOpen },
    { label: "Exams", href: "exams.index", icon: ClipboardList },
    { label: "Events", href: "events.index", icon: CalendarDays },
    { label: "Messages", href: "messages.index", icon: MessageSquare },
  ],
  student: [
    { label: "Dashboard", href: "dashboard", icon: LayoutDashboard },
    { label: "Events", href: "events.index", icon: CalendarDays },
    { label: "Messages", href: "messages.index", icon: MessageSquare },
  ],
  parent: [
    { label: "Dashboard", href: "dashboard", icon: LayoutDashboard },
    { label: "Events", href: "events.index", icon: CalendarDays },
    { label: "Messages", href: "messages.index", icon: MessageSquare },
  ],
  bursar: [
    { label: "Dashboard", href: "dashboard", icon: LayoutDashboard },
    { label: "Students", href: "students.index", icon: GraduationCap },
    { label: "Fees", href: "fees.index", icon: Wallet },
    { label: "Messages", href: "messages.index", icon: MessageSquare },
  ],
  lab_attendant: [
    { label: "Dashboard", href: "dashboard", icon: LayoutDashboard },
    { label: "Labs", href: "labs.index", icon: FlaskConical },
    { label: "Messages", href: "messages.index", icon: MessageSquare },
  ],
};

function isActive(routeName) {
  try {
    return (
      route().current(routeName) ||
      route().current(`${routeName.split(".")[0]}.*`)
    );
  } catch {
    return false;
  }
}

export default function AuthenticatedLayout({ header, children }) {
  const { auth, flash } = usePage().props;
  const user = auth.user;
  const nav = NAV_BY_ROLE[user.role] ?? NAV_BY_ROLE.student;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const mobilePrimary = nav.slice(0, 4); // top 4 items get a bottom-tab slot

  return (
    <div className="min-h-screen bg-paper lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-navy-100 bg-white lg:flex lg:flex-col">
        <div className="flex items-center gap-2 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-900 font-display text-lg font-semibold text-gold-500">
            H
          </div>
          <span className="font-display text-xl font-semibold text-navy-900">
            HighHub
          </span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-2">
          {nav.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={route(href)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive(href)
                  ? "register-rule bg-navy-50 text-navy-900"
                  : "text-slate-600 hover:bg-navy-50 hover:text-navy-900"
              }`}
            >
              <Icon size={18} strokeWidth={2} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-navy-100 p-3">
          <div className="mb-2 rounded-xl bg-navy-50 px-3 py-2">
            <p className="truncate text-sm font-semibold text-navy-900">
              {user.name}
            </p>
            <p className="text-xs capitalize text-slate-500">
              {user.role.replace("_", " ")}
            </p>
          </div>
          <Link
            href={route("logout")}
            method="post"
            as="button"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-coral-50 hover:text-coral-700"
          >
            <LogOut size={16} /> Log out
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-navy-100 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 font-display text-base font-semibold text-gold-500">
            H
          </div>
          <span className="font-display text-lg font-semibold text-navy-900">
            HighHub
          </span>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="rounded-lg p-2 text-navy-900"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Mobile drawer (full nav + logout) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            className="absolute inset-0 bg-navy-950/40"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute right-0 top-0 h-full w-72 bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-lg font-semibold text-navy-900">
                Menu
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg p-1.5 text-slate-500"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mb-3 rounded-xl bg-navy-50 px-3 py-2">
              <p className="truncate text-sm font-semibold text-navy-900">
                {user.name}
              </p>
              <p className="text-xs capitalize text-slate-500">
                {user.role.replace("_", " ")}
              </p>
            </div>
            <nav className="space-y-1">
              {nav.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={route(href)}
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                    isActive(href)
                      ? "bg-navy-50 text-navy-900"
                      : "text-slate-600"
                  }`}
                >
                  <Icon size={18} /> {label}
                </Link>
              ))}
            </nav>
            <Link
              href={route("logout")}
              method="post"
              as="button"
              className="mt-4 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-coral-700"
            >
              <LogOut size={16} /> Log out
            </Link>
          </div>
        </div>
      )}

      <div className="flex-1 pb-20 lg:pb-0">
        {header && (
          <div className="border-b border-navy-100 bg-white px-4 py-5 lg:px-8">
            <h1 className="font-display text-2xl font-semibold text-navy-900">
              {header}
            </h1>
          </div>
        )}

        {flash?.success && (
          <div className="mx-4 mt-4 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 lg:mx-8">
            {flash.success}
          </div>
        )}

        <main className="p-4 lg:p-8">{children}</main>
      </div>

      {/* Mobile bottom tab bar - the primary surface for students/teachers on phones */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-navy-100 bg-white/95 backdrop-blur lg:hidden">
        {mobilePrimary.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={route(href)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${
              isActive(href) ? "text-navy-900" : "text-slate-400"
            }`}
          >
            <Icon size={20} strokeWidth={isActive(href) ? 2.4 : 2} />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
