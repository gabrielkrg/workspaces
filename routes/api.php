<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TimeTrackingController;
use App\Http\Controllers\Api\WorkspaceController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\AiController;

Route::middleware(['auth:sanctum'])->prefix('api')->group(function () {
    // Workspaces
    Route::get('/workspaces', [WorkspaceController::class, 'index'])->name('api.workspaces');
    Route::get('/workspace/tasks', [WorkspaceController::class, 'getWorkspaceTasks'])->name('api.workspace.tasks');
    Route::get('/workspace/clients', [WorkspaceController::class, 'getWorkspaceClients'])->name('api.workspace.clients');
    Route::get('/workspace/tags', [WorkspaceController::class, 'getWorkspaceTags'])->name('api.workspace.tags');

    // Tasks
    Route::get('/tasks/heatmap', [TaskController::class, 'heatmap'])->name('tasks.heatmap');
    Route::get('/tasks/latest', [TaskController::class, 'latestChanges'])->name('tasks.latest');

    // Time Tracking
    Route::get('time-tracking/trackables', [TimeTrackingController::class, 'trackables'])->name('time-tracking.trackables');

    // Tags
    Route::get('/tags', [TagController::class, 'index'])->name('api.tags');

    // AI
    Route::post('/generate-with-ai', [AiController::class, 'generateWithAi'])->name('api.generate-with-ai');
});
