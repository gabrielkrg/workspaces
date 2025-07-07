<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Kanban;
use App\Models\Workspace;
use App\Models\Tag;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class KanbanController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('view', $workspace);

        $kanbans = Kanban::where('workspace_id', $workspace->id)->withCount('cards')->with(['columns' => function ($query) {
            $query->orderBy('order');
        }])->get();

        $tags = $workspace->tags()->orderBy('name', 'asc')->get();

        return Inertia::render('Kanban/Index', [
            'kanbans' => $kanbans,
            'tags' => $tags,
        ]);
    }

    public function show(Kanban $kanban, Request $request)
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('view', $workspace);

        $kanban->load([
            'columns' => function ($query) {
                $query->orderBy('order');
            },
            'columns.cards' => function ($query) use ($request) {
                $query->orderBy('created_at', 'desc')->with('tasks')->with('tags');
            }
        ]);

        if ($request->filled('search')) {
            $kanban->load([
                'columns' => function ($query) {
                    $query->orderBy('order');
                },
                'columns.cards' => function ($query) use ($request) {
                    $query->where('title', 'like', '%' . $request->search . '%')->with('tasks')->with('tags');
                }
            ]);

            // dd($kanban);
        }

        $tags = $workspace->tags()->orderBy('name', 'asc')->get();
        $clients = $workspace->clients()->orderBy('name', 'asc')->get();

        return Inertia::render('Kanban/Show', [
            'kanban' => $kanban,
            'tags' => $tags,
            'clients' => $clients,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $request->validate([
            'name' => 'required|string|max:255',
            'columns' => 'required|array',
            'columns.*.name' => 'required|string|max:255',
            'columns.*.order' => 'required|integer',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        $kanban = Kanban::create([
            'name' => $request->name,
            'workspace_id' => $workspace->id,
            'user_id' => $user->id,
        ]);

        foreach ($request->columns as $column) {
            $kanban->columns()->create([
                'name' => $column['name'],
                'order' => $column['order'],
            ]);
        }

        return redirect()->route('kanban.show', $kanban->id)->with('success', 'Kanban created successfully');
    }

    public function update(Request $request, Kanban $kanban)
    {
        $workspace = Workspace::findOrFail($kanban->workspace_id);

        $this->authorize('update', $workspace);

        $request->validate([
            'name' => 'required|string|max:255',
            'columns' => 'required|array',
            'columns.*.name' => 'required|string|max:255',
            'columns.*.order' => 'required|integer',
            'columns.*.id' => 'nullable|integer',
        ]);

        $kanban->update([
            'name' => $request->name,
        ]);

        // Get all column IDs from the request
        $requestColumnIds = collect($request->columns)
            ->pluck('id')
            ->filter()
            ->toArray();

        // Delete columns that are not in the request
        $kanban->columns()
            ->whereNotIn('id', $requestColumnIds)
            ->delete();

        foreach ($request->columns as $column) {
            if (isset($column['id'])) {
                $kanban->columns()->updateOrCreate(
                    ['id' => $column['id']],
                    [
                        'name' => $column['name'],
                        'order' => $column['order']
                    ]
                );
            } else {
                $kanban->columns()->create([
                    'name' => $column['name'],
                    'order' => $column['order']
                ]);
            }
        }

        return redirect()->back()->with('success', 'Kanban updated successfully');
    }

    public function delete(Kanban $kanban)
    {
        $workspace = Workspace::findOrFail($kanban->workspace_id);

        $this->authorize('delete', $workspace);

        $kanban->delete();

        return redirect()->route('kanban.index')->with('success', 'Kanban deleted successfully');
    }
}
