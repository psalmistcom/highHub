<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SchoolClass extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'level', 'class_teacher_id', 'capacity'];

    public function classTeacher(): BelongsTo
    {
        return $this->belongsTo(TeacherProfile::class, 'class_teacher_id');
    }

    public function students(): HasMany
    {
        return $this->hasMany(StudentProfile::class);
    }

    public function subjects(): BelongsToMany
    {
        return $this->belongsToMany(Subject::class, 'class_subject');
    }

    public function teachingAssignments(): HasMany
    {
        return $this->hasMany(TeacherClassSubject::class);
    }
}
