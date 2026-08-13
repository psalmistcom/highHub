<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TeacherProfile extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'staff_id', 'subject_specialization', 'qualification', 'date_joined'];

    protected function casts(): array
    {
        return ['date_joined' => 'date'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function classesLed(): HasMany
    {
        return $this->hasMany(SchoolClass::class, 'class_teacher_id');
    }

    public function subjects(): BelongsToMany
    {
        return $this->belongsToMany(Subject::class, 'teacher_class_subject', 'teacher_profile_id', 'subject_id')->distinct();
    }

    public function teachingAssignments(): HasMany
    {
        return $this->hasMany(TeacherClassSubject::class);
    }
}
