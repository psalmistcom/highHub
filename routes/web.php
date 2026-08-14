<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\FeeController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\LabController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SchoolClassController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TeacherController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::get('/', fn() => Inertia::render('Welcome'))->name('home');

// ---- Guest / auth ----
Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});
Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')->name('logout');

// ---- Authenticated app ----
Route::middleware('auth')->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    // Messaging & events are shared across every role.
    Route::get('messages', [MessageController::class, 'index'])->name('messages.index');
    Route::post('messages', [MessageController::class, 'store'])->name('messages.store');
    Route::patch('messages/{message}/read', [MessageController::class, 'markRead'])->name('messages.read');

    Route::get('events', [EventController::class, 'index'])->name('events.index');

    // Students/teachers/classes/subjects lists are viewable (read-only, policy-checked)
    // by admin, teacher and bursar - only Admin can create/edit/delete.
    Route::middleware('role:admin,teacher,bursar')->group(function () {
        Route::get('students', [StudentController::class, 'index'])->name('students.index');
        Route::get('teachers', [TeacherController::class, 'index'])->name('teachers.index');
        Route::get('classes', [SchoolClassController::class, 'index'])->name('classes.index');
        Route::get('subjects', [SubjectController::class, 'index'])->name('subjects.index');
    });

    // ---- Admin: full user & academic-structure management ----
    Route::middleware('role:admin')->group(function () {
        Route::get('students/create', [StudentController::class, 'create'])->name('students.create');
        Route::post('students', [StudentController::class, 'store'])->name('students.store');
        Route::get('students/{student}/edit', [StudentController::class, 'edit'])->name('students.edit');
        Route::patch('students/{student}', [StudentController::class, 'update'])->name('students.update');
        Route::delete('students/{student}', [StudentController::class, 'destroy'])->name('students.destroy');

        Route::post('teachers', [TeacherController::class, 'store'])->name('teachers.store');
        Route::patch('teachers/{teacher}', [TeacherController::class, 'update'])->name('teachers.update');
        Route::delete('teachers/{teacher}', [TeacherController::class, 'destroy'])->name('teachers.destroy');

        Route::post('classes', [SchoolClassController::class, 'store'])->name('classes.store');
        Route::patch('classes/{class}', [SchoolClassController::class, 'update'])->name('classes.update');
        Route::delete('classes/{class}', [SchoolClassController::class, 'destroy'])->name('classes.destroy');

        Route::post('subjects', [SubjectController::class, 'store'])->name('subjects.store');
        Route::patch('subjects/{subject}', [SubjectController::class, 'update'])->name('subjects.update');
        Route::delete('subjects/{subject}', [SubjectController::class, 'destroy'])->name('subjects.destroy');

        Route::post('events', [EventController::class, 'store'])->name('events.store');
        Route::patch('events/{event}', [EventController::class, 'update'])->name('events.update');
        Route::delete('events/{event}', [EventController::class, 'destroy'])->name('events.destroy');
        Route::post('exams', [ExamController::class, 'store'])->name('exams.store');
    });

    // ---- Teacher: attendance & grading ----
    Route::middleware('role:admin,teacher')->group(function () {
        Route::get('classes/{class}/attendance', [AttendanceController::class, 'show'])->name('attendance.show');
        Route::post('classes/{class}/attendance', [AttendanceController::class, 'store'])->name('attendance.store');

        Route::get('exams', [ExamController::class, 'index'])->name('exams.index');
        Route::get('exams/{exam}/classes/{class}/gradebook', [GradeController::class, 'show'])->name('grades.show');
        Route::post('exams/{exam}/grades', [GradeController::class, 'store'])->name('grades.store');
    });

    // Report card - any authenticated role, scoped in the controller/policy.
    Route::get('exams/{exam}/report-card', [GradeController::class, 'reportCard'])->name('grades.report-card');

    // ---- Bursar: fees ----
    Route::middleware('role:admin,bursar')->group(function () {
        Route::get('fees', [FeeController::class, 'index'])->name('fees.index');
        Route::post('fees/structures', [FeeController::class, 'storeStructure'])->name('fees.structures.store');
        Route::post('invoices/{invoice}/pay', [FeeController::class, 'pay'])->name('invoices.pay');
    });

    // ---- Lab attendant: lab resources ----
    Route::middleware('role:admin,lab_attendant,teacher')->group(function () {
        Route::get('labs', [LabController::class, 'index'])->name('labs.index');
        Route::post('labs/{lab}/usage', [LabController::class, 'logUsage'])->name('labs.usage.store');
    });
});
// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

// require __DIR__.'/auth.php';
