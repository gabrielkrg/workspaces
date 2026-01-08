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

    /**
     * Get the active or last paused time tracking for the current user
     */
    public function active(): JsonResponse
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('view', $workspace);

        // Primeiro tenta encontrar um timer ativo (is_running = true)
        $timeTracking = TimeTracking::where('user_id', $user->id)
            ->where('workspace_id', $workspace->id)
            ->where('is_running', true)
            ->with('workspace')
            ->first();

        // Se não encontrar ativo, busca o último pausado (com end_time mas não finalizado)
        if (!$timeTracking) {
            $timeTracking = TimeTracking::where('user_id', $user->id)
                ->where('workspace_id', $workspace->id)
                ->where('is_running', false)
                ->whereNotNull('start_time')
                ->whereNotNull('end_time')
                ->with('workspace')
                ->orderBy('updated_at', 'desc')
                ->first();
        }

        if (!$timeTracking) {
            return response()->json(null);
        }

        return response()->json($timeTracking);
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

        $timeTracking = TimeTracking::create([
            'user_id' => $user->id,
            'workspace_id' => $workspace->id,
            'trackable_id' => $request->trackable_id,
            'trackable_type' => $request->trackable_type,
            'start_time' => Carbon::now('UTC'),
            'is_running' => true,
        ]);

        if (!$timeTracking) {
            return response()->json([
                'message' => 'Failed to start time tracking',
            ], 500);
        }

        return response()->json($timeTracking->fresh()->load('workspace'));
    }

    public function pause(TimeTracking $timeTracking): JsonResponse
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $timeTracking->update([
            'end_time' => Carbon::now('UTC'),
            'is_running' => false,
        ]);

        return response()->json($timeTracking->fresh()->load('workspace'));
    }

    public function resume(TimeTracking $timeTracking): JsonResponse
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $now = Carbon::now('UTC');

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

        return response()->json($timeTracking->fresh()->load('workspace'));
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

        return response()->json($timeTracking->fresh()->load('workspace'));
    }
}
