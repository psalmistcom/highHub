<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LabResource extends Model
{
    use HasFactory;

    protected $table = 'lab_resources';

    protected $fillable = ['lab_id', 'name', 'quantity', 'condition'];

    public function lab(): BelongsTo
    {
        return $this->belongsTo(Lab::class);
    }

    public function usageLogs(): HasMany
    {
        return $this->hasMany(LabUsageLog::class);
    }
}
