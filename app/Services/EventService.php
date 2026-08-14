<?php

namespace App\Services;

use App\Models\Event;
use Illuminate\Pagination\LengthAwarePaginator;

class EventService
{
    public function upcoming(int $limit = 5)
    {
        return Event::query()->where('event_date', '>=', now())->orderBy('event_date')->limit($limit)->get();
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Event::query()->orderByDesc('event_date')->paginate($perPage);
    }

    public function create(array $data, int $createdBy): Event
    {
        return Event::create([...$data, 'created_by' => $createdBy]);
    }

    public function update(Event $event, array $data): Event
    {
        $event->update($data);

        return $event->fresh();
    }

    public function delete(Event $event): void
    {
        $event->delete();
    }
}
