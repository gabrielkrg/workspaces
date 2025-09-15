<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Roster;
use Illuminate\Support\Facades\Auth;
use App\Models\Workspace;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class RosterController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $user = Auth::user();
        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('view', $workspace);

        $rosters = Roster::where('workspace_id', $workspace->id)->get();

        return Inertia::render('Roster/Index', [
            'rosters' => $rosters,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $user = Auth::user();
        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        Roster::create([
            'name' => $request->name,
            'workspace_id' => $workspace->id,
            'user_id' => $user->id,
        ]);

        return redirect()->back()->with('success', 'Roster created successfully');
    }
}
