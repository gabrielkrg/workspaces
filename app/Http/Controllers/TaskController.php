<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Models\Task;
use App\Models\Workspace;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TaskController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {

        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('view', $workspace);

        $query = Task::with('tags')
            ->where('workspace_id', $user->workspace_id)
            ->orderBy('done', 'asc')
            ->orderBy('created_at', 'desc');

        if ($request->filled('tag')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('name', $request->tag);
            });
        }

        // ✅ Filtro por done (true ou false)
        if ($request->filled('done')) {
            $done = filter_var($request->done, FILTER_VALIDATE_BOOLEAN); // converte 'true'/'false' em boolean
            $query->where('done', $done);
        }

        // 🔠 Filtro por título (search)
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $tasks = $query->get();
        $tags = $workspace->tags()->get();

        return Inertia::render('Task/Index', [
            'tasks' => $tasks,
            'tags' => $tags,
            'filters' => $request->only(['tag', 'done', 'search']),
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'repeat' => 'required|string|in:daily,weekly,monthly,none',
            'description' => 'nullable|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'delete_after' => 'required|boolean',
        ]);

        $task = new Task([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? '',
            'repeat' => $validated['repeat'],
            'done' => false,
            'user_id' => $user->id,
            'workspace_id' => $user->workspace_id,
            'delete_after' => $validated['delete_after'],
        ]);

        $task->save();

        if (!empty($validated['tags'])) {
            $tagIds = collect($validated['tags'])->map(function ($tagName) use ($user) {
                return Tag::firstOrCreate([
                    'name' => $tagName,
                    'user_id' => $user->id,
                    'workspace_id' => $user->workspace_id,
                ])->id;
            });

            $task->tags()->attach($tagIds);
        }

        return redirect()->back()->with('success', 'Task created successfully!');
    }

    public function update(Task $task, Request $request)
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'repeat' => 'sometimes|string|in:daily,weekly,monthly,none',
            'description' => 'nullable|string',
            'done' => 'sometimes|boolean',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'delete_after' => 'sometimes|boolean',
        ]);

        $task->update($validated);

        if (!empty($validated['tags'])) {
            $tagIds = collect($validated['tags'])->map(function ($tagName) use ($user) {
                return Tag::firstOrCreate([
                    'name' => $tagName,
                    'user_id' => $user->id,
                    'workspace_id' => $user->workspace_id,
                ])->id;
            });

            $task->tags()->sync($tagIds);
        }

        if($task->delete_after && $task->done)
        {
            $this->delete($task);
            return redirect()->back()->with('success', 'Task concluded and deleted successfully!');
        }

        return redirect()->back()->with('success', 'Task updated successfully!');
    }

    public function delete(Task $task)
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $task->delete();

        return redirect()->back()->with('success', 'Task deleted successfully!');
    }
}
