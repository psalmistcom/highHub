<?php

namespace App\Http\Controllers;

use App\Http\Requests\SendMessageRequest;
use App\Models\Message;
use App\Models\User;
use App\Services\MessageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    public function __construct(protected MessageService $messages) {}

    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Messages/Index', [
            'inbox' => $this->messages->inboxFor($user),
            'sent' => $this->messages->sentBy($user),
            'contacts' => $this->contactsFor($user),
        ]);
    }

    /**
     * Who this user is allowed to see in the "message someone" picker.
     * Admin can reach anyone; everyone else can always reach the admin
     * office plus whoever their role naturally talks to day-to-day.
     */
    protected function contactsFor(User $user): \Illuminate\Support\Collection
    {
        $query = User::where('id', '!=', $user->id)->where('is_active', true);

        if (! $user->hasRole('admin')) {
            $query->where(function ($q) {
                $q->where('role', 'admin')->orWhere('role', 'teacher');
            });
        }

        return $query->orderBy('name')->get(['id', 'name', 'role']);
    }

    public function store(SendMessageRequest $request): RedirectResponse
    {
        $this->messages->send(
            $request->user(),
            $request->validated('receiver_id'),
            $request->validated('subject'),
            $request->validated('body')
        );

        return back()->with('success', 'Message sent.');
    }

    public function markRead(Message $message): RedirectResponse
    {
        $this->authorize('view', $message);
        $this->messages->markRead($message);

        return back();
    }
}
