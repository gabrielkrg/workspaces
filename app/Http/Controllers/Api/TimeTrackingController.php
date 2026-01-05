<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\Workspace;
use App\Models\TimeTracking;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TimeTrackingController extends Controller
{
    use AuthorizesRequests;

    public function trackablesTypes(): JsonResponse
    {
        return response()->json([
            'types' => TimeTracking::$types,
        ]);
    }

    public function trackables(Request $request): JsonResponse
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('view', $workspace);

        $trackableType = $request->input('trackable_type');

        switch ($trackableType) {
            case 'App\Models\Ticket':
                $trackables = $workspace->tickets()->get();
                break;
            case 'App\Models\Task':
                $trackables = $workspace->tasks()->get();
                break;
            case 'App\Models\Card':
                $trackables = $workspace->cards()->get();
                break;
            default:
                $trackables = [];
                break;
        }

        if (!$trackables) {
            return response()->json([
                'message' => 'No trackables found',
            ], 404);
        }

        return response()->json($trackables);
    }

    public function start(Request $request)
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $request->validate([
            'trackable_id' => 'required|integer',
            'trackable_type' => 'required|string|max:255',
        ]);

        $now = Carbon::now();

        $timeTracking = TimeTracking::create([
            'user_id' => $user->id,
            'workspace_id' => $user->workspace->id,
            'trackable_id' => $request->trackable_id,
            'trackable_type' => $request->trackable_type,
            'start_time' => $now,
            'is_running' => true,
        ]);

        if (!$timeTracking) {
            return response()->json([
                'message' => 'Failed to start time tracking',
            ], 500);
        }

        return response()->json($timeTracking);
    }

    public function show(TimeTracking $timeTracking): JsonResponse
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('view', $workspace);

        return response()->json($timeTracking);
    }
}
