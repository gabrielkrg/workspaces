<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $query = $user->tasks()
            ->where('workspace_id', $user->workspace_id)
            ->latest();

        $tasks = $query->get();

        return Inertia::render('Task/Index', ['tasks' => $tasks]);
    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $user = Auth::user();

        $task = new Task([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? '',
            'done' => false,
            'user_id' => $user->id,
            'workspace_id' => $user->workspace_id,
        ]);

        $task->save();

        return redirect()->back()->with('success', 'Task created successfully!');
    }

    public function update(Task $task, Request $request)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'done' => 'sometimes|boolean',
        ]);

        $task->update($validated);

        return redirect()->back()->with('success', 'Task updated successfully!');
    }

    public function delete(Task $task)
    {
        $task->delete();

        return redirect()->back()->with('success', 'Task deleted successfully!');
    }
}
