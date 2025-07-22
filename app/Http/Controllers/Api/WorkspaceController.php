<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use App\Models\Workspace;
use App\Models\Task;

class WorkspaceController extends Controller
{
    public function index(): JsonResponse
    {
        $user = Auth::user();
        $workspaces = $user->workspaces()->latest()->get();

        return response()->json($workspaces);
    }

    public function getWorkspaceTasks(): JsonResponse
    {
        $user = Auth::user();
        $workspace = Workspace::findOrFail($user->workspace_id);
        $tasks = Task::where('workspace_id', $workspace->id)->get();

        return response()->json($tasks);
    }
}
