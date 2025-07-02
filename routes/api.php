<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TimeTrackingController;
use App\Http\Controllers\Api\WorkspaceController;
use App\Http\Controllers\Api\TaskController;

Route::middleware(['auth:sanctum'])->prefix('api')->group(function () {
    Route::get('/workspaces', [WorkspaceController::class, 'index'])->name('api.workspaces');
    Route::get('/tasks', [TaskController::class, 'getWorkspaceTasks'])->name('api.workspace.tasks');

    // Tasks
    Route::get('/tasks/heatmap', [TaskController::class, 'heatmap'])->name('tasks.heatmap');
    Route::get('/tasks/latest', [TaskController::class, 'latestChanges'])->name('tasks.latest');

    // Time Tracking
    Route::get('time-tracking/trackables', [TimeTrackingController::class, 'trackables'])->name('time-tracking.trackables');
});