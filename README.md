# HighHub — School Management Portal

Laravel 12 + Inertia.js + React scaffold for the SMS described in the PRD.
This is **not** a full Laravel project — it's the app-specific layer meant to be
copied onto a fresh `laravel new` install, per your instructions.

## 1. Setup

```bash
composer create-project laravel/laravel highhub
cd highhub

composer require inertiajs/inertia-laravel tightenco/ziggy laravel/breeze --dev
php artisan breeze:install react   # scaffolds Inertia/React wiring & vite deps, then...
```

Breeze will generate its own `AuthenticatedSessionController`, auth views, layouts
and `app.jsx`. **Overwrite them with the ones in this package** — this package's
versions are wired for HighHub's roles, nav and design system. Then copy over
everything else:

```bash
# from inside this "highhub" folder, into your fresh laravel install:
cp -r app/*        ../your-laravel-app/app/
cp -r database/*   ../your-laravel-app/database/
cp routes/web.php  ../your-laravel-app/routes/web.php
cp -r resources/js/*  ../your-laravel-app/resources/js/
cp resources/css/app.css ../your-laravel-app/resources/css/app.css
cp tailwind.config.js vite.config.js postcss.config.js package.json ../your-laravel-app/
```

Then:

```bash
composer require inertiajs/inertia-laravel tightenco/ziggy   # if not already added
npm install
php artisan migrate:fresh --seed
npm run dev   # or: npm run build
php artisan serve
```

Register the role middleware in `bootstrap/app.php` (Laravel 12's new middleware
registration style):

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias(['role' => \App\Http\Middleware\EnsureUserHasRole::class]);
})
```

Demo accounts seeded (`php artisan db:seed`), all with password `password`:
`admin@highhub.test`, `teacher@highhub.test`, `parent@highhub.test`,
`student@highhub.test`, `bursar@highhub.test`, `lab@highhub.test`.

## 2. Architecture

**Roles**: admin, teacher, student, parent, bursar, lab_attendant — stored as a
`role` column on `users` (see `App\Enums\RoleEnum`), not a separate table.

**No self-registration.** Only Admins create accounts
— `UserService::createUser()` is the one place a `User` + role-profile row gets
made, for every role.

**Service layer.** Controllers stay thin — validate (via Form Requests), call a
service, redirect. Business logic (transactions, generating admission numbers,
computing attendance/fee summaries, report cards) lives in `app/Services/`.
`StudentController` + `StudentService` is the fully-built reference; the same
shape applies to every other module.

**RBAC.** Route-level `role:` middleware is the first gate; Policies
(`app/Policies/`) are the second, so a controller/service called from
elsewhere (a queued job, an Artisan command, a future API) still enforces the
same rules. `StudentProfilePolicy` is the fullest example (admin: everything,
teacher/bursar: read, parent: only their linked children, student: only self).

## 3. What's fully built vs. scaffolded

**Fully built** (backend + frontend): authentication, role-aware dashboard,
mobile-responsive shell (sidebar on desktop, bottom tab bar + drawer on
mobile), and the **Students module** end-to-end (list/search/paginate,
create, edit, delete) as the reference implementation.

**Backend complete, frontend forms not yet built**: Teachers, Classes,
Subjects, Attendance register, Exams/Gradebook/Report cards, Events, Fees
(structures + invoices + payments), Labs, Messaging. Every model, migration,
service method, controller action, route and policy exists and is callable
today (e.g. via Postman or `php artisan tinker`) — what's left is copying the
Students Create/Edit page pattern for each. This was a deliberate scope call
given the size of the PRD; happy to build out any specific module's UI next.

**Not built — flag for a follow-up pass**: password-reset flow (Breeze
provides this out of the box, just re-point its views at this design system),
file/photo uploads (`avatar_path` column exists, no upload UI yet), real-time
notifications (the `notifications` table + Laravel's notification system is
wired for email/database channels; broadcasting would need Echo + Pusher/Reverb),
and CSV/PDF exports for attendance & fee reports.

## 4. Design system — "HighHub"

Brief: a school register, not a generic SaaS dashboard. The signature element
is the **register rule** — a gold accent bar + hairline pulled from an
exercise-book margin (`.register-rule` in `app.css`), used on card headers and
active nav items. Status pills use a **stamp** style (bordered, small-caps,
rounded) — like a grade stamp on a report card.

| Token                   | Value                                                       | Use |
| ----------------------- | ----------------------------------------------------------- | --- |
| `navy-900` `#16234A`    | Primary — trust, formality (sidebar, buttons, headings)     |
| `gold-500` `#E8A93A`    | Accent — achievement (register-rule, focus rings, progress) |
| `emerald-500` `#2F9E56` | Present / paid / active                                     |
| `coral-500` `#DE5B4C`   | Absent / overdue / destructive                              |
| `paper` `#FAF7F0`       | App background                                              |

Type: **Fraunces** (display, headings only — book-like serif with real
character), **Plus Jakarta Sans** (UI/body — legible at small sizes on
phones), **IBM Plex Mono** (admission numbers, scores, stat figures — evokes
a printed register).

Mobile-first was taken literally: the primary nav _is_ a bottom tab bar on
phones (students/teachers), not a hamburger-only afterthought — the drawer is
there for the full menu, but the 4 most-used links are always one thumb-tap
away.

## 5. Suggestions worth considering for a v2

- **Term/session as a first-class settings record** (current term, current
  academic year) instead of typing it into every exam/fee form.
- **Timetable view** — `teacher_class_subject` already has `day_of_week` /
  `start_time` / `end_time`, just needs a calendar-grid UI.
- **Parent-teacher messaging restricted per child** (right now any two users
  can message; you may want to scope it to shared-class relationships).
- **Audit log** for grade/attendance edits, given these affect a child's record.
