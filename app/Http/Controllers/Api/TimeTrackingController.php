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

    /**
     * Get time tracking stats for charts
     */
    public function stats(Request $request): JsonResponse
    {
        $user = Auth::user();
        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('view', $workspace);

        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'trackable_type' => 'nullable|string',
        ]);

        $startDate = $request->input('start_date')
            ? Carbon::parse($request->input('start_date'))->startOfDay()
            : Carbon::now()->subDays(7)->startOfDay();

        $endDate = $request->input('end_date')
            ? Carbon::parse($request->input('end_date'))->endOfDay()
            : Carbon::now()->endOfDay();

        $query = TimeTracking::where('workspace_id', $workspace->id)
            ->whereNotNull('start_time')
            ->whereNotNull('end_time')
            ->where('start_time', '>=', $startDate)
            ->where('start_time', '<=', $endDate);

        if ($request->input('trackable_type') && $request->input('trackable_type') !== 'all') {
            $query->where('trackable_type', $request->input('trackable_type'));
        }

        $timeTrackings = $query->get();

        $periodStats = [];
        $typeStats = [];

        foreach ($timeTrackings as $tracking) {
            $duration = $tracking->start_time->diffInSeconds($tracking->end_time);

            $key = $tracking->start_time->format('Y-m-d');

            if (!isset($periodStats[$key])) {
                $periodStats[$key] = 0;
            }
            $periodStats[$key] += $duration;

            // Stats by type
            $type = $tracking->trackable_type;
            if (!isset($typeStats[$type])) {
                $typeStats[$type] = 0;
            }
            $typeStats[$type] += $duration;
        }

        // Fill in missing days
        $filledStats = [];
        $period = Carbon::parse($startDate)->daysUntil($endDate);
        foreach ($period as $date) {
            $key = $date->format('Y-m-d');
            $filledStats[$key] = $periodStats[$key] ?? 0;
        }

        // Convert seconds to hours
        $hours = [];
        foreach ($filledStats as $key => $seconds) {
            $hours[$key] = round($seconds / 3600, 2);
        }

        $typeHours = [];
        foreach ($typeStats as $type => $seconds) {
            $label = collect(TimeTracking::$types)->firstWhere('model', $type)['label'] ?? $type;
            $typeHours[$label] = round($seconds / 3600, 2);
        }

        $totalHours = round(array_sum($periodStats) / 3600, 2);

        return response()->json([
            'daily' => $hours,
            'by_type' => $typeHours,
            'total_hours' => $totalHours,
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d'),
        ]);
    }
}
