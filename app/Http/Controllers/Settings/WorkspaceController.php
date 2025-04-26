<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Workspace;
use App\Models\WorkspaceInvite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;


class WorkspaceController extends Controller
{
    use AuthorizesRequests;

    public function edit(Request $request)
    {
        $workspaces = Auth::user()->workspaces;
        // $workspaces = Auth::user()->workspaces()->wherePivot('role', 'owner')->get();


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


    public function generateInviteLink(Request $request, Workspace $workspace)
    {
        $this->authorize('update', $workspace);

        $invite = WorkspaceInvite::create([
            'workspace_id' => $workspace->id,
            'token' => Str::uuid(),
            'expires_at' => now()->addMinutes(5),
        ]);

        return response()->json([
            'url' => route('workspace.invite.screen', $invite->token),
        ]);
    }

    public function inviteScreen($token)
    {
        $invite = WorkspaceInvite::where('token', $token)->firstOrFail();

        if ($invite->isExpired()) {
            return response()->json(['message' => 'This link have expired.'], 410);
        }

        return Inertia::render('Workspace/Invite', ['token' => $token]);
    }

    public function acceptInvite($token)
    {
        $invite = WorkspaceInvite::where('token', $token)->firstOrFail();

        if ($invite->isExpired()) {
            return response()->json(['message' => 'This link have expired.'], 410);
        }

        $user = auth()->user();

        $invite->workspace->users()->syncWithoutDetaching([
            $user->id => ['role' => 'viewer'],
        ]);

        $invite->delete();

        return redirect()->route('dashboard')->with('success', 'You were added to the workpace!');
    }
}
