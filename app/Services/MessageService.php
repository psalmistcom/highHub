<?php

namespace App\Services;

use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class MessageService
{
    public function inboxFor(User $user): Collection
    {
        return Message::with('sender')
            ->where('receiver_id', $user->id)
            ->latest()
            ->get();
    }

    public function sentBy(User $user): Collection
    {
        return Message::with('receiver')
            ->where('sender_id', $user->id)
            ->latest()
            ->get();
    }

    public function send(User $sender, int $receiverId, ?string $subject, string $body): Message
    {
        return Message::create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiverId,
            'subject' => $subject,
            'body' => $body,
        ]);
    }

    public function markRead(Message $message): void
    {
        $message->markAsRead();
    }

    public function unreadCount(User $user): int
    {
        return Message::where('receiver_id', $user->id)->whereNull('read_at')->count();
    }
}
