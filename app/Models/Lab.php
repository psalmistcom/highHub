<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lab extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'location', 'attendant_id'];

    public function attendant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'attendant_id');
    }

    public function resources(): HasMany
    {
        return $this->hasMany(LabResource::class);
    }

    public function usageLogs(): HasMany
    {
        return $this->hasMany(LabUsageLog::class);
    }
}
