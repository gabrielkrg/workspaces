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
        $user = Auth::user();

        return Inertia::render('settings/Workspace', [
            'user' => $user,
            'workspaces' => $user->workspaces,
            'workspace' => $user->workspace ? $user->workspace->load('users') : null
        ]);
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

        $user->update([
            'workspace_id' => $workspace->id,
        ]);

        return redirect()->route('workspace.edit')->with('success', 'Workspace created successfully!');
    }

    public function update(Request $request, Workspace $workspace)
    {
        $this->authorize('update', $workspace);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'time_zone' => 'required|string',
            'users' => 'array',
            'users.*.id' => 'required|integer|exists:users,id',
            'users.*.pivot.role' => 'required|string|in:editor,viewer,owner',
        ]);

        $workspace->update([
            'name' => $validated['name'],
            'time_zone' => $validated['time_zone'],
        ]);

        if (isset($validated['users'])) {
            $currentUserIds = $workspace->users->pluck('id')->toArray();

            $newUserIds = collect($validated['users'])->pluck('id')->toArray();

            $usersToRemove = array_diff($currentUserIds, $newUserIds);
            foreach ($usersToRemove as $userId) {
                $workspace->users()->detach($userId);
            }

            foreach ($validated['users'] as $user) {
                $workspace->users()->updateExistingPivot($user['id'], [
                    'role' => $user['pivot']['role'],
                ]);
            }
        }

        return redirect()->route('workspace.edit')->with('success', 'Workspace updated successfully!');
    }


    public function set(Request $request)
    {
        $validated = $request->validate([
            'workspace_id' => 'required|exists:workspaces,id',
        ]);

        Auth::user()->update($validated);

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

    public function destroy(Workspace $workspace)
    {
        $this->authorize('update', $workspace);

        $workspace->delete();

        return redirect()->route('workspace.edit')->with('success', 'Workspace deleted successfully!');
    }
}
