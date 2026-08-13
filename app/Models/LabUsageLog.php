<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LabUsageLog extends Model
{
    use HasFactory;

    protected $table = 'lab_usage_logs';

    protected $fillable = [
        'lab_id',
        'lab_resource_id',
        'school_class_id',
        'used_by',
        'purpose',
        'used_at',
        'returned_at',
    ];

    protected function casts(): array
    {
        return ['used_at' => 'datetime', 'returned_at' => 'datetime'];
    }

    public function lab(): BelongsTo
    {
        return $this->belongsTo(Lab::class);
    }

    public function resource(): BelongsTo
    {
        return $this->belongsTo(LabResource::class, 'lab_resource_id');
    }

    public function schoolClass(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'used_by');
    }
}
