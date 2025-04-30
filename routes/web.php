<?php

use App\Http\Controllers\CalendarController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\KanbanController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\WorkspaceController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TaskController as APITaskController;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
})->middleware(['auth', 'verified'])->name('home');

Route::get('dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth'])->group(function () {
    // Tasks
    Route::get('tasks', [TaskController::class, 'index'])->name('tasks.index');
    Route::post('tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::put('tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
    Route::delete('tasks/{task}', [TaskController::class, 'delete'])->name('tasks.delete');

    // Calendar
    Route::get('calendar', [CalendarController::class, 'index'])->name('calendar.index');

    // Kanban
    Route::get('kanban', [KanbanController::class, 'index'])->name('kanban.index');

    // Events
    Route::get('events', [EventController::class, 'index'])->name('events.index');

    // Notes
    Route::get('notes', [NoteController::class, 'index'])->name('notes.index');

    // Workspaces
    Route::get('workspaces', [WorkspaceController::class, 'index'])->name('workspaces.index');
    Route::post('workspaces', [WorkspaceController::class, 'store'])->name('workspaces.store');
});

// API
Route::middleware(['auth'])->group(function () {
    Route::get('/tasks/heatmap', [APITaskController::class, 'heatmap'])->name('tasks.heatmap');
    Route::get('/tasks/latest', [APITaskController::class, 'latestChanges'])->name('tasks.latest');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
