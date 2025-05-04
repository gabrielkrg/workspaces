<?php

use App\Http\Controllers\Api\UserController as ApiUserController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\KanbanController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\WorkspaceController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TaskController as ApiTaskController;
use App\Http\Controllers\ColumnController;
use App\Http\Controllers\CardController;

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

    // Tags
    Route::get('tags', [TagController::class, 'index'])->name('tags.index');
    Route::post('tags', [TagController::class, 'store'])->name('tags.store');
    Route::put('tags/{tag}', [TagController::class, 'update'])->name('tags.update');
    Route::delete('tags/{tag}', [TagController::class, 'delete'])->name('tags.delete');

    // Calendar
    Route::get('calendar', [CalendarController::class, 'index'])->name('calendar.index');

    // Kanban
    Route::get('kanban', [KanbanController::class, 'index'])->name('kanban.index');
    Route::get('kanban/{kanban}', [KanbanController::class, 'show'])->name('kanban.show');
    Route::post('kanban', [KanbanController::class, 'store'])->name('kanban.store');
    Route::put('kanban/{kanban}', [KanbanController::class, 'update'])->name('kanban.update');
    Route::delete('kanban/{kanban}', [KanbanController::class, 'delete'])->name('kanban.delete');

    // Columns
    Route::post('kanban/{kanban}/columns', [ColumnController::class, 'store'])->name('kanban.columns.store');
    Route::put('kanban/{kanban}/columns/{column}', [ColumnController::class, 'update'])->name('kanban.columns.update');
    Route::delete('kanban/{kanban}/columns/{column}', [ColumnController::class, 'delete'])->name('kanban.columns.delete');

    // Cards
    Route::post('cards/{kanban}', [CardController::class, 'store'])->name('cards.store');
    Route::patch('cards/{card}', [CardController::class, 'update'])->name('cards.update');
    Route::delete('cards/{card}', [CardController::class, 'delete'])->name('cards.delete');

    // Events
    Route::get('events', [EventController::class, 'index'])->name('events.index');

    // Notes
    Route::get('notes', [NoteController::class, 'index'])->name('notes.index');
    Route::post('notes', [NoteController::class, 'store'])->name('notes.store');
    Route::put('notes/{note}', [NoteController::class, 'update'])->name('notes.update');
    Route::delete('notes/{note}', [NoteController::class, 'delete'])->name('notes.delete');

    // Workspaces
    Route::get('workspaces', [WorkspaceController::class, 'index'])->name('workspaces.index');
    Route::post('workspaces', [WorkspaceController::class, 'store'])->name('workspaces.store');
});

// API
Route::middleware(['auth'])->group(function () {
    // Tasks
    Route::get('/tasks/heatmap', [ApiTaskController::class, 'heatmap'])->name('tasks.heatmap');
    Route::get('/tasks/latest', [ApiTaskController::class, 'latestChanges'])->name('tasks.latest');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
