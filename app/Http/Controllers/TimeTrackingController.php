<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TimeTracking;
use App\Models\Workspace;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Carbon\Carbon;

class TimeTrackingController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('view', $workspace);

        $timeTrackings = TimeTracking::where('workspace_id', $workspace->id)->with('trackable')->orderBy('updated_at', 'desc')->get();

        return Inertia::render('TimeTracking/Index', [
            'timeTrackings' => $timeTrackings,
            'types' => TimeTracking::$types,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $validated = $request->validate([
            'trackable_id' => 'required|integer',
            'trackable_type' => 'required|string|max:255',
            'start_time' => 'required|date',
            'end_time' => 'nullable|date',
        ]);

        // Convert from workspace timezone to UTC for storage
        $workspaceTimezone = $workspace->time_zone ?? config('app.timezone');

        $validated['start_time'] = Carbon::parse($validated['start_time'], $workspaceTimezone)->setTimezone('UTC');

        if (!empty($validated['end_time'])) {
            $validated['end_time'] = Carbon::parse($validated['end_time'], $workspaceTimezone)->setTimezone('UTC');
        }

        TimeTracking::create(
            array_merge($validated, [
                'user_id' => $user->id,
                'workspace_id' => $user->workspace->id,
            ])
        );

        return redirect()->route('time-tracking.index')->with('success', 'Time tracking created successfully');
    }

    public function update(Request $request, TimeTracking $timeTracking)
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $validated = $request->validate([
            'trackable_id' => 'required|integer',
            'trackable_type' => 'required|string|max:255',
            'start_time' => 'required|date',
            'end_time' => 'required|date',
            'is_running' => 'required|boolean',
        ]);

        // Convert from workspace timezone to UTC for storage
        $workspaceTimezone = $workspace->time_zone ?? config('app.timezone');

        $validated['start_time'] = Carbon::parse($validated['start_time'], $workspaceTimezone)->setTimezone('UTC');
        $validated['end_time'] = Carbon::parse($validated['end_time'], $workspaceTimezone)->setTimezone('UTC');

        $timeTracking->update($validated);

        return redirect()->back()->with('success', 'Time tracking updated successfully');
    }

    public function destroy(TimeTracking $timeTracking)
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $timeTracking->delete();

        return redirect()->route('time-tracking.index')->with('success', 'Time tracking deleted successfully');
    }
}
