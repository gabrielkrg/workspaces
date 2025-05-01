<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Models\Workspace;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TagController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $user = Auth::user();
        $workspace = Workspace::findOrFail($user->workspace_id);
        $tags = $workspace->tags()->orderBy('created_at', 'desc')->get();

        return Inertia::render('Tag/Index', ['tags' => $tags]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'color' => 'nullable|string|max:7',
        ]);

        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $tag = new Tag(
            array_merge($validated, [
                'user_id' => $user->id,
                'workspace_id' => $user->workspace_id
            ])
        );

        $tag->save();

        return redirect()->back()->with('success', 'Tag created successfully');
    }

    public function update(Tag $tag, Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'color' => 'nullable|string|max:7',
        ]);

        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $tag->update($validated);

        return redirect()->back()->with('success', 'Tag updated successfully');
    }

    public function delete(Tag $tag)
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $tag->delete();

        return redirect()->back()->with('success', 'Tag deleted successfully!');
    }
}
