<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\Workspace;
use App\Models\TimeTracking;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
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
            'elapsed_time' => null,
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

        $elapsedTime = $timeTracking->start_time->diffInSeconds($timeTracking->end_time);

        $timeTracking->update([
            'end_time' => Carbon::now('UTC'),
            'elapsed_time' => $elapsedTime,
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
                'elapsed_time' => null,
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
            'trackable_type' => 'nullable|array',
            'trackable_type.*' => 'string',
        ]);

        $selectedTypes = $request->input('trackable_type', []);

        $types = array_values(array_filter(
            TimeTracking::$types,
            fn($type) => in_array($type['model'], $selectedTypes, true)
        ));


        $startDate = $request->input('start_date')
            ? Carbon::parse($request->input('start_date'))->startOfDay()
            : Carbon::now()->subDays(7)->startOfDay();

        $endDate = $request->input('end_date')
            ? Carbon::parse($request->input('end_date'))->endOfDay()
            : Carbon::now()->endOfDay();


        $rows = TimeTracking::where('workspace_id', $workspace->id)
            ->whereNotNull('start_time')
            ->whereNotNull('end_time')
            ->whereBetween('start_time', [$startDate, $endDate])
            ->when(!empty($selectedTypes), function ($q) use ($selectedTypes) {
                $q->whereIn('trackable_type', $selectedTypes);
            })
            ->selectRaw('
                trackable_type,
                DATE(start_time) as day,
                SUM(elapsed_time) as total_seconds
            ')
            ->groupBy('trackable_type', 'day')
            ->get();


        $days = collect(
            CarbonPeriod::create(
                $startDate->copy()->startOfDay(),
                $endDate->copy()->startOfDay()
            )
        )->map(fn(Carbon $date) => $date->toDateString());

        $daysTemplate = $days->mapWithKeys(fn($day) => [$day => 0])->toArray();

        $typesTrackings = [];

        foreach ($types as $type) {
            $typesTrackings[$type['model']] = [
                'label' => $type['label'],
                'data' => $daysTemplate,
            ];
        }

        foreach ($rows as $row) {
            if (!isset($typesTrackings[$row->trackable_type])) {
                continue;
            }

            $typesTrackings[$row->trackable_type]['data'][$row->day] =
                (int) $row->total_seconds;
        }


        return response()->json(['types' => $typesTrackings]);
    }
}
