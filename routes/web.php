<?php

use App\Http\Controllers\CalendarController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\KanbanController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ColumnController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TimeTrackingController;
use App\Http\Controllers\ClientController;

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

    // Tickets
    Route::get('tickets', [TicketController::class, 'index'])->name('tickets.index');
    Route::post('tickets', [TicketController::class, 'store'])->name('tickets.store');
    Route::put('tickets/{ticket}', [TicketController::class, 'update'])->name('tickets.update');
    Route::delete('tickets/{ticket}', [TicketController::class, 'destroy'])->name('tickets.destroy');

    // Clients
    Route::get('clients', [ClientController::class, 'index'])->name('clients.index');
    Route::post('clients', [ClientController::class, 'store'])->name('clients.store');
    Route::put('clients/{client}', [ClientController::class, 'update'])->name('clients.update');
    Route::delete('clients/{client}', [ClientController::class, 'delete'])->name('clients.delete');

    // Time Tracking
    Route::get('time-tracking', [TimeTrackingController::class, 'index'])->name('time-tracking.index');
    Route::post('time-tracking', [TimeTrackingController::class, 'store'])->name('time-tracking.store');
    Route::put('time-tracking/{timeTracking}', [TimeTrackingController::class, 'update'])->name('time-tracking.update');
    Route::delete('time-tracking/{timeTracking}', [TimeTrackingController::class, 'destroy'])->name('time-tracking.destroy');

    // Kanban
    Route::get('kanban', [KanbanController::class, 'index'])->name('kanban.index');
    Route::get('kanban/{kanban}', [KanbanController::class, 'show'])->name('kanban.show');
    Route::post('kanban', [KanbanController::class, 'store'])->name('kanban.store');
    Route::put('kanban/{kanban}', [KanbanController::class, 'update'])->name('kanban.update');
    Route::delete('kanban/{kanban}', [KanbanController::class, 'delete'])->name('kanban.delete');

    // Columns
    Route::post('columns/{kanban}', [ColumnController::class, 'store'])->name('columns.store');
    Route::put('columns/{column}', [ColumnController::class, 'update'])->name('columns.update');
    Route::delete('columns/{column}', [ColumnController::class, 'delete'])->name('columns.delete');
    Route::get('columns/{column}/cards', [ColumnController::class, 'getCards'])->name('columns.get.cards');

    // Cards
    Route::post('cards/{kanban}', [CardController::class, 'store'])->name('cards.store');
    Route::put('cards/{card}', [CardController::class, 'update'])->name('cards.update');
    Route::delete('cards/{card}', [CardController::class, 'delete'])->name('cards.delete');
    Route::post('cards/{card}/tasks', [CardController::class, 'attachTask'])->name('cards.attach.task');
    Route::get('cards/{card}/tasks', [CardController::class, 'getTasks'])->name('cards.get.tasks');

    Route::post('bulk-cards', [KanbanController::class, 'bulkCards'])->name('cards.bulk');

    // Events
    Route::get('events', [EventController::class, 'index'])->name('events.index');

    // Notes
    Route::get('notes', [NoteController::class, 'index'])->name('notes.index');
    Route::get('notes/{note}', [NoteController::class, 'show'])->name('notes.show');
    Route::post('notes', [NoteController::class, 'store'])->name('notes.store');
    Route::put('notes/{note}', [NoteController::class, 'update'])->name('notes.update');
    Route::delete('notes/{note}', [NoteController::class, 'delete'])->name('notes.delete');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/api.php';
