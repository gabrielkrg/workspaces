<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TimeTrackingController;
use App\Http\Controllers\Api\WorkspaceController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\AiController;

Route::middleware(['auth:sanctum'])->group(function () {
    // Workspaces
    Route::get('/workspaces', [WorkspaceController::class, 'index'])->name('api.workspaces');

    Route::get('/tasks', [WorkspaceController::class, 'getWorkspaceTasks'])->name('api.workspace.tasks');

    // Tasks
    Route::get('/tasks/heatmap', [TaskController::class, 'heatmap'])->name('tasks.heatmap');
    Route::get('/tasks/latest', [TaskController::class, 'latestChanges'])->name('tasks.latest');

    // Time Tracking
    Route::get('time-tracking/trackables', [TimeTrackingController::class, 'trackables'])->name('api.time-tracking.trackables');
    Route::get('time-tracking/trackables-types', [TimeTrackingController::class, 'trackablesTypes'])->name('api.time-tracking.trackables-types');
    Route::post('time-tracking/start', [TimeTrackingController::class, 'start'])->name('api.time-tracking.start');
    Route::get('time-tracking/{timeTracking}', [TimeTrackingController::class, 'show'])->name('api.time-tracking.show');

    // Tags
    Route::get('/tags', [TagController::class, 'index'])->name('api.tags');

    // AI
    Route::post('/generate-with-ai', [AiController::class, 'generateWithAi'])->name('api.generate-with-ai');
});
