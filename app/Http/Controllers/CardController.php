<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Task;
use App\Models\Kanban;
use App\Models\Workspace;
use App\Models\Tag;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;

class CardController extends Controller
{
    use AuthorizesRequests;

    public function store(Request $request, Kanban $kanban)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'column_id' => 'required|exists:columns,id',
            'order' => 'required|integer',
            'tags' => 'sometimes|array',
            'tags.*' => 'string|max:50',
            'client_id' => 'nullable|exists:clients,id',
        ]);


        $user = Auth::user();
        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $card = Card::create(array_merge($validated, [
            'workspace_id' => $workspace->id,
            'kanban_id' => $kanban->id,
            'user_id' => $user->id,
        ]));

        if (!empty($request->tags)) {
            $tagIds = collect($request->tags)->map(function ($tagName) use ($user) {
                return Tag::firstOrCreate([
                    'name' => $tagName,
                    'user_id' => $user->id,
                    'workspace_id' => $user->workspace_id,
                ])->id;
            });

            $card->tags()->attach($tagIds);
        }

        return redirect()->route('kanban.show', $kanban->id)->with('success', 'Card created successfully');
    }

    public function update(Request $request, Card $card)
    {
        $user = Auth::user();
        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'order' => 'sometimes|integer',
            'column_id' => 'sometimes|exists:columns,id',
            'client_id' => 'nullable|exists:clients,id',
            'tags' => 'sometimes|array',
            'tags.*' => 'string|max:50',
        ]);

        $card->update(array_merge(Arr::except($validated, ['tags'])));

        if (array_key_exists('tags', $validated)) {
            // create tags if they don't exist
            $tagIds = collect($validated['tags'])->map(function ($tagName) use ($user) { 
                return Tag::firstOrCreate([
                    'name' => $tagName,
                    'user_id' => $user->id,
                    'workspace_id' => $user->workspace_id,
                ])->id;
            });

            $card->tags()->sync($tagIds);
            $card->tasks()->each(function ($task) use ($tagIds) {
                $task->tags()->sync($tagIds);
            });
        }

        $card->tasks()->each(function ($task) use ($validated) {
            $task->update([
                'client_id' => $validated['client_id'] ?? null,
            ]);
        });

        return redirect()->route('kanban.show', $card->kanban_id)->with('success', 'Card updated successfully');
    }

    public function delete(Kanban $kanban, Card $card)
    {
        $user = Auth::user();
        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $card->delete();

        return redirect()->back()->with('success', 'Card deleted successfully');
    }

    public function attachTask(Request $request, Card $card)
    {
        $user = Auth::user();
        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'tags' => 'sometimes|array',
            'tags.*' => 'string|max:50',
            'client_id' => 'nullable|exists:clients,id',
        ]);

        $task = Task::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'client_id' => $validated['client_id'] ?? null,
            'workspace_id' => $workspace->id,
            'user_id' => $user->id,
        ]);

        if (!empty($request->tags)) {
            $tagIds = collect($request->tags)->map(function ($tagName) use ($user) {
                return Tag::firstOrCreate([
                    'name' => $tagName,
                    'user_id' => $user->id,
                    'workspace_id' => $user->workspace_id,
                ])->id;
            });

            $task->tags()->attach($tagIds);
        }

        $card->tasks()->attach($task->id);

        return redirect()->back()->with('success', 'Task added successfully');
    }

    public function getTasks(Card $card): JsonResponse
    {
        $tasks = $card->tasks()->get();

        return response()->json([
            'tasks' => $tasks,
        ]);
    }
}
