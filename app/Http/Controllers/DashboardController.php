<?php

namespace App\Http\Controllers;

use App\Services\AttendanceService;
use App\Services\EventService;
use App\Services\FeeService;
use App\Services\MessageService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected EventService $events,
        protected MessageService $messages,
        protected AttendanceService $attendance,
        protected FeeService $fees,
    ) {}

    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $widgets = [
            'upcoming_events' => $this->events->upcoming(5),
            'unread_messages' => $this->messages->unreadCount($user),
        ];

        if ($user->hasRole('student') && $user->studentProfile) {
            $widgets['attendance_summary'] = $this->attendance->studentSummary($user->studentProfile->id);
            $widgets['outstanding_fees'] = $this->fees->outstandingFor($user->studentProfile);
        }

        if ($user->hasRole('parent') && $user->parentProfile) {
            $widgets['children'] = $user->parentProfile->students()->with('schoolClass')->get()
                ->map(fn ($s) => [
                    'id' => $s->id,
                    'name' => $s->user->name,
                    'class' => $s->schoolClass?->name,
                    'attendance' => $this->attendance->studentSummary($s->id),
                    'outstanding_fees' => $this->fees->outstandingFor($s),
                ]);
        }

        return Inertia::render('Dashboard/Index', [
            'role' => $user->role->value,
            'widgets' => $widgets,
        ]);
    }
}
