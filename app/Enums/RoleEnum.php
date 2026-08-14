<?php

namespace App\Enums;

enum RoleEnum: string
{
    case Admin = 'admin';
    case Teacher = 'teacher';
    case Student = 'student';
    case ParentGuardian = 'parent';
    case Bursar = 'bursar';
    case LabAttendant = 'lab_attendant';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Admin',
            self::Teacher => 'Teacher',
            self::Student => 'Student',
            self::ParentGuardian => 'Parent',
            self::Bursar => 'Bursar',
            self::LabAttendant => 'Lab Attendant',
        };
    }

    /** Roles that use the back-office (non student/parent) shell. */
    public static function staff(): array
    {
        return [self::Admin->value, self::Teacher->value, self::Bursar->value, self::LabAttendant->value];
    }
}
