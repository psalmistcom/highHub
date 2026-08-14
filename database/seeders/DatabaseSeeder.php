<?php

namespace Database\Seeders;

use App\Models\ParentProfile;
use App\Models\SchoolClass;
use App\Models\StudentProfile;
use App\Models\Subject;
use App\Models\TeacherProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // --- Core staff accounts (default password: password) ---
        $admin = User::create([
            'name' => 'HighHub Admin',
            'email' => 'admin@highhub.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $bursar = User::create([
            'name' => 'Bola Bursar',
            'email' => 'bursar@highhub.test',
            'password' => Hash::make('password'),
            'role' => 'bursar',
        ]);

        $labAttendant = User::create([
            'name' => 'Lekan Labtech',
            'email' => 'lab@highhub.test',
            'password' => Hash::make('password'),
            'role' => 'lab_attendant',
        ]);

        // --- Subjects ---
        $subjects = collect([
            ['name' => 'Mathematics', 'code' => 'MTH'],
            ['name' => 'English Language', 'code' => 'ENG'],
            ['name' => 'Basic Science', 'code' => 'BSC'],
        ])->map(fn($s) => Subject::create($s));

        // --- A teacher + class ---
        $teacherUser = User::create([
            'name' => 'Mrs. Ada Okafor',
            'email' => 'teacher@highhub.test',
            'password' => Hash::make('password'),
            'role' => 'teacher',
        ]);
        $teacherProfile = TeacherProfile::create([
            'user_id' => $teacherUser->id,
            'staff_id' => 'T-25-0001',
            'subject_specialization' => 'Mathematics',
            'date_joined' => now(),
        ]);

        $class = SchoolClass::create([
            'name' => 'JSS 1A',
            'level' => 'JSS 1',
            'class_teacher_id' => $teacherProfile->id,
            'capacity' => 40,
        ]);
        $class->subjects()->attach($subjects->pluck('id'));
        foreach ($subjects as $subject) {
            $teacherProfile->teachingAssignments()->create([
                'school_class_id' => $class->id,
                'subject_id' => $subject->id,
            ]);
        }

        // --- A parent with a child in that class ---
        $parentUser = User::create([
            'name' => 'Mr. Tunde Balogun',
            'email' => 'parent@highhub.test',
            'password' => Hash::make('password'),
            'role' => 'parent',
        ]);
        $parentProfile = ParentProfile::create(['user_id' => $parentUser->id]);

        $studentUser = User::create([
            'name' => 'Chidi Balogun',
            'email' => 'student@highhub.test',
            'password' => Hash::make('password'),
            'role' => 'student',
        ]);
        $studentProfile = StudentProfile::create([
            'user_id' => $studentUser->id,
            'admission_no' => 'ADM-25-0001',
            'school_class_id' => $class->id,
            'gender' => 'male',
            'date_of_birth' => now()->subYears(12),
            'admission_date' => now(),
        ]);
        $parentProfile->students()->attach($studentProfile->id, ['relationship' => 'father']);

        $this->command->info('HighHub seeded. Every demo account password is: password');
    }
}
