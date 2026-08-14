<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;
use App\Models\Event;
use App\Services\EventService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function __construct(protected EventService $events) {}

    public function index(): Response
    {
        return Inertia::render('Events/Index', [
            'events' => $this->events->paginate(),
        ]);
    }

    public function store(StoreEventRequest $request): RedirectResponse
    {
        $this->events->create($request->validated(), $request->user()->id);

        return redirect()->route('events.index')->with('success', 'Event published.');
    }

    public function update(StoreEventRequest $request, Event $event): RedirectResponse
    {
        $this->authorize('update', $event);
        $this->events->update($event, $request->validated());

        return back()->with('success', 'Event updated.');
    }

    public function destroy(Event $event): RedirectResponse
    {
        $this->authorize('delete', $event);
        $this->events->delete($event);

        return redirect()->route('events.index')->with('success', 'Event removed.');
    }
}
