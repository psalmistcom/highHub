import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatCard from '@/Components/StatCard';
import EmptyState from '@/Components/EmptyState';

export default function DashboardIndex({ role, widgets }) {
    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {role === 'student' && widgets.attendance_summary && (
                    <>
                        <StatCard
                            label="Attendance rate"
                            value={widgets.attendance_summary.attendance_rate != null ? `${widgets.attendance_summary.attendance_rate}%` : '—'}
                            tone="emerald"
                        />
                        <StatCard label="Outstanding fees" value={`₦${Number(widgets.outstanding_fees ?? 0).toLocaleString()}`} tone="gold" />
                    </>
                )}
                <StatCard label="Unread messages" value={widgets.unread_messages} tone="navy" />
                <StatCard label="Upcoming events" value={widgets.upcoming_events?.length ?? 0} tone="coral" />
            </div>

            {role === 'parent' && widgets.children?.length > 0 && (
                <div className="mt-6">
                    <h2 className="register-rule mb-3 font-display text-lg font-semibold text-navy-900">Your children</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {widgets.children.map((child) => (
                            <div key={child.id} className="app-card">
                                <p className="font-semibold text-navy-900">{child.name}</p>
                                <p className="text-sm text-slate-500">{child.class ?? 'Unassigned class'}</p>
                                <div className="mt-3 flex items-center justify-between text-sm">
                                    <span className="text-slate-600">
                                        Attendance: <span className="font-mono">{child.attendance.attendance_rate ?? '—'}%</span>
                                    </span>
                                    <span className="font-mono text-gold-700">
                                        ₦{Number(child.outstanding_fees).toLocaleString()} due
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-6">
                <h2 className="register-rule mb-3 font-display text-lg font-semibold text-navy-900">Upcoming events</h2>
                {widgets.upcoming_events?.length ? (
                    <div className="app-card divide-y divide-navy-100">
                        {widgets.upcoming_events.map((event) => (
                            <div key={event.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                                <div>
                                    <p className="font-medium text-navy-900">{event.title}</p>
                                    <p className="text-sm text-slate-500">{event.location}</p>
                                </div>
                                <p className="font-mono text-sm text-slate-500">
                                    {new Date(event.event_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="No events scheduled"
                        description="Admins can publish school events from the Events page - they'll show up here for everyone."
                        action={<Link href={route('events.index')} className="btn-secondary">View events</Link>}
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
