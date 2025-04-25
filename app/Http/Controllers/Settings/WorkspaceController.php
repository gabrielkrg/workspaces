<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WorkspaceController extends Controller
{
    public function edit(Request $request)
    {
        $workspaces = Auth::user()->workspaces;
        // $workspaces = Workspace::get()->all();

        return Inertia::render('settings/Workspace', ['workspaces' => $workspaces]);
    }


    public function update(Request $request)
    {
        $validated = $request->validate([
            'workspace_id' => 'required|exists:workspaces,id',
        ]);

        Auth::user()->update($validated);

        return redirect()->back()->with('success', 'Workspace changed successfully!');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $user = Auth::user();

        $workspace = Workspace::create([
            'name' => $request->name,
            'user_id' => $user->id,
        ]);

        $workspace->users()->attach($user->id, ['role' => 'owner']);

        return redirect()->back()->with('success', 'Workspace changed successfully!');
    }
}
