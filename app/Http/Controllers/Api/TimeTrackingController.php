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

        // Usa o timezone do workspace
        $timezone = $workspace->time_zone ?? config('app.timezone');
        $now = Carbon::now($timezone);

        $timeTracking = TimeTracking::create([
            'user_id' => $user->id,
            'workspace_id' => $workspace->id,
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

    public function pause(TimeTracking $timeTracking): JsonResponse
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        // Usa o timezone do workspace
        $timezone = $workspace->time_zone ?? config('app.timezone');
        $now = Carbon::now($timezone);

        $timeTracking->update([
            'end_time' => $now,
            'is_running' => false,
        ]);

        return response()->json($timeTracking->fresh());
    }

    public function resume(TimeTracking $timeTracking): JsonResponse
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        // Usa o timezone do workspace
        $timezone = $workspace->time_zone ?? config('app.timezone');
        $now = Carbon::now($timezone);

        // Calcula o tempo decorrido antes da pausa (end_time - start_time)
        // e ajusta o start_time para compensar o tempo pausado
        if ($timeTracking->start_time && $timeTracking->end_time) {
            $elapsedSeconds = $timeTracking->start_time->diffInSeconds($timeTracking->end_time);
            $newStartTime = $now->copy()->subSeconds($elapsedSeconds);

            $timeTracking->update([
                'start_time' => $newStartTime,
                'end_time' => null,
                'is_running' => true,
            ]);
        } else {
            $timeTracking->update([
                'end_time' => null,
                'is_running' => true,
            ]);
        }

        return response()->json($timeTracking->fresh());
    }

    public function reset(TimeTracking $timeTracking): JsonResponse
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $timeTracking->update([
            'start_time' => null,
            'end_time' => null,
            'is_running' => false,
        ]);

        return response()->json($timeTracking->fresh());
    }

    public function show(TimeTracking $timeTracking): JsonResponse
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('view', $workspace);

        return response()->json($timeTracking);
    }
}
