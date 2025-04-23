<?php

use App\Http\Controllers\EventController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth'])->group(function () {
    // Tasks
    Route::get('tasks', [TaskController::class, 'index'])->name('tasks.index');

    // Events
    Route::get('events', [EventController::class, 'index'])->name('events.index');

    // Notes
    Route::get('notes', [NoteController::class, 'index'])->name('notes.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
