<?php

namespace App\Models;

use App\Enums\Term;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'term', 'academic_year', 'start_date', 'end_date'];

    protected function casts(): array
    {
        return [
            'term' => Term::class,
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function subjects(): BelongsToMany
    {
        return $this->belongsToMany(Subject::class, 'exam_subject')
            ->withPivot(['school_class_id', 'max_score'])
            ->withTimestamps();
    }

    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class);
    }
}
