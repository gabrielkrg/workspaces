<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class TaskController extends Controller
{
    public function getWorkspaceTasks(): JsonResponse
    {
        $user = Auth::user();
        $workspace = Workspace::findOrFail($user->workspace_id);
        $tasks = Task::where('workspace_id', $workspace->id)->get();

        return response()->json($tasks);
    }

    public function heatmap()
    {
        $user = Auth::user();

        $tasks = Task::where('workspace_id', $user->workspace_id)
            ->get()
            ->groupBy(function ($task) {
                return $task->created_at->toDateString();
            })
            ->map(function ($tasksPerDay) {
                return [
                    'count' => $tasksPerDay->count(),
                    'date' => $tasksPerDay->first()->created_at->toDateString(),
                ];
            })
            ->values();

        return response()->json($tasks);
    }

    public function latestChanges()
    {
        $user = Auth::user();
        $workspaceIds = $user->workspaces()->pluck('workspaces.id');

        $tasks = Task::with(['tags', 'workspace'])
            ->whereIn('workspace_id', $workspaceIds)
            ->orderBy('updated_at', 'desc')
            ->take(10)
            ->get();

        return response()->json($tasks);
    }

}
