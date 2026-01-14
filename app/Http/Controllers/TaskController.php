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
            ->where('workspace_id', $user->workspace_id);

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('tags')) {
            $tags = is_array($request->tags) ? $request->tags : [$request->tags];
            foreach ($tags as $tag) {
                $query->whereHas('tags', function ($q) use ($tag) {
                    $q->where('name', $tag);
                });
            }
        }

        if ($request->filled('done')) {
            $done = filter_var($request->done, FILTER_VALIDATE_BOOLEAN);
            $query->where('done', $done);
        }

        if ($request->filled('order')) {
            switch ($request->order) {
                case 'recent':
                    $query->orderBy('created_at', 'desc');
                    break;
                case 'oldest':
                    $query->orderBy('created_at', 'asc');
                    break;
                case 'title':
                    $query->orderBy('title', 'asc');
                    break;
                case 'highlight':
                    $query->orderBy('highlight', 'desc');
                    break;
                default:
                    $query->orderBy('done', 'asc')
                        ->orderBy('created_at', 'desc');
            }
        } else {
            $query->orderBy('done', 'asc')
                ->orderBy('created_at', 'desc');
        }

        if ($request->filled('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        $tasks = $query->with([
            'client:id,name'
        ])->get();
        $tags = $workspace->tags()->orderBy('name', 'asc')->get();
        $clients = $workspace->clients()->orderBy('name', 'asc')->get();

        return Inertia::render('Task/Index', [
            'tasks' => $tasks,
            'tags' => $tags,
            'clients' => $clients,
            'filters' => $request->only(['search', 'tags', 'done']),
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
            'client_id' => 'nullable|exists:clients,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'delete_after' => 'required|boolean',
        ]);

        $task = new Task(array_merge($validated, [
            'done' => false,
            'user_id' => $user->id,
            'workspace_id' => $user->workspace_id,
        ]));

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

        $workspace = Workspace::findOrFail($task->workspace_id);

        $this->authorize('update', $workspace);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'repeat' => 'sometimes|string|in:daily,weekly,monthly,none',
            'description' => 'nullable|string',
            'client_id' => 'nullable|exists:clients,id',
            'done' => 'sometimes|boolean',
            'tags' => 'sometimes|array',
            'tags.*' => 'string|max:50',
            'delete_after' => 'sometimes|boolean',
            'highlight' => 'sometimes|boolean',
        ]);

        $task->update($validated);

        if (array_key_exists('tags', $validated)) {
            $tagIds = collect($validated['tags'])->map(function ($tagName) use ($user) {
                return Tag::firstOrCreate([
                    'name' => $tagName,
                    'user_id' => $user->id,
                    'workspace_id' => $user->workspace_id,
                ])->id;
            });

            $task->tags()->sync($tagIds);
        }

        if ($task->delete_after && $task->done) {
            $this->delete($task);
            return redirect()->back()->with('success', 'Task concluded and deleted successfully!');
        }

        return redirect()->back()->with('success', 'Task updated successfully!');
    }

    public function delete(Task $task)
    {
        $workspace = Workspace::findOrFail($task->workspace_id);

        $this->authorize('update', $workspace);

        $task->delete();

        return redirect()->back()->with('success', 'Task deleted successfully!');
    }
}
