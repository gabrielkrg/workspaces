<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Kanban;
use App\Models\Workspace;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class KanbanController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $user = Auth::user();
        $workspace = Workspace::where('id', $user->workspace_id)->first();

        $this->authorize('view', $workspace);

        $kanbans = Kanban::where('workspace_id', $workspace->id)->with(['columns' => function($query) {
            $query->orderBy('order');
        }])->get();

        return Inertia::render('Kanban/Index', [
            'kanbans' => $kanbans,
        ]);
    }

    public function show(Kanban $kanban)
    {
        $user = Auth::user();
        $workspace = Workspace::where('id', $user->workspace_id)->first();

        $this->authorize('view', $workspace);

        $kanban->load(['columns' => function($query) {
            $query->orderBy('order');
        }, 'columns.cards']);


        return Inertia::render('Kanban/Show', [
            'kanban' => $kanban,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $workspace = Workspace::where('id', $user->workspace_id)->first();

        $this->authorize('update', $workspace);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'columns' => 'required|array',
            'columns.*.name' => 'required|string|max:255',
            'columns.*.order' => 'required|integer',
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
        
        return redirect()->route('kanban.index')->with('success', 'Kanban created successfully');
    }

    public function update(Request $request, Kanban $kanban)
    {
        $user = Auth::user();
        $workspace = Workspace::where('id', $user->workspace_id)->first();

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
        
        return redirect()->route('kanban.index')->with('success', 'Kanban updated successfully');
    }

    public function delete(Kanban $kanban)
    {
        $user = Auth::user();
        $workspace = Workspace::where('id', $user->workspace_id)->first();

        $this->authorize('delete', $workspace);

        $kanban->delete();

        return redirect()->route('kanban.index')->with('success', 'Kanban deleted successfully');
    }

    public function moveCard(Request $request)
    {
        $user = Auth::user();
        $workspace = Workspace::where('id', $user->workspace_id)->first();

        $this->authorize('update', $workspace);

        $request->validate([
            'card_id' => 'required|exists:cards,id',
            'column_id' => 'required|exists:columns,id',
            'order' => 'required|integer',
        ]); 
        
        $card = Card::findOrFail($request->card_id);
        $card->column_id = $request->column_id;
        $card->order = $request->order;
        $card->save();

        return redirect()->route('kanban.show', $card->kanban_id)->with('success', 'Card moved successfully'); 
    }
}
