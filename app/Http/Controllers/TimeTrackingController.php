<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TimeTracking;
use App\Models\Workspace;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TimeTrackingController extends Controller
{
    use AuthorizesRequests; 

    public function index()
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('view', $workspace);

        $timeTrackings = TimeTracking::where('workspace_id', $workspace->id)->get();

        $types = [
            [
                'label' => 'Ticket',
                'model' => 'App\\Models\\Ticket',
            ],
            [
                'label' => 'Task',
                'model' => 'App\\Models\\Task',
            ],
            [
                'label' => 'Card',
                'model' => 'App\\Models\\Card',
            ],
        ];

        return Inertia::render('TimeTracking/Index', [
            'timeTrackings' => $timeTrackings,
            'types' => $types,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $request->validate([
            'trackable_id' => 'required|integer',
            'trackable_type' => 'required|string|max:255',
            'start_time' => 'required|date',
            'end_time' => 'required|date',
            'duration' => 'required|integer',
            'is_running' => 'required|boolean',

        ]);

        $request->merge([
            'user_id' => $user->id,
            'workspace_id' => $user->workspace->id,
        ]);

        $timeTracking = TimeTracking::create($request->all());

        return redirect()->route('time-tracking.index')->with('success', 'Time tracking created successfully');
    }

    public function update(Request $request, TimeTracking $timeTracking)
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $request->validate([
            'trackable_id' => 'required|integer',
            'trackable_type' => 'required|string|max:255',
            'start_time' => 'required|date',
            'end_time' => 'required|date',
            'duration' => 'required|integer',
        ]);

        $timeTracking->update($request->all());

        return redirect()->route('time-tracking.index')->with('success', 'Time tracking updated successfully');
    }

    public function destroy(TimeTracking $timeTracking)
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $timeTracking->delete();

        return redirect()->route('time-tracking.index')->with('success', 'Time tracking deleted successfully');
    }

    public function trackables(Request $request): JsonResponse
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('view', $workspace);

        $trackableType = $request->input('trackable_type');
        dd($trackableType);

        $trackables = $workspace->trackables()->where('type', $trackableType)->get();

        return response()->json($trackables);
    }
}
