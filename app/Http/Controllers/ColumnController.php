<?php

namespace App\Http\Controllers;

use App\Models\Column;
use App\Models\Kanban;
use App\Models\Workspace;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class ColumnController extends Controller
{
    use AuthorizesRequests;

    public function store(Request $request, Kanban $kanban)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'order' => 'required|integer',
        ]);

        $user = Auth::user();
        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $column = Column::create([
            'name' => $request->name,
            'kanban_id' => $kanban->id,
            'order' => $request->order,
        ]);

        return redirect()->back()->with('success', 'Column created successfully');
    }

    public function update(Request $request, Kanban $kanban, Column $column)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $user = Auth::user();
        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $column->update([
            'name' => $request->name,
        ]);

        return redirect()->back()->with('success', 'Column updated successfully');
    }

    public function delete(Kanban $kanban, Column $column)
    {
        $user = Auth::user();
        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $column->delete();

        return redirect()->back()->with('success', 'Column deleted successfully');
    }

    public function getCards(Column $column): JsonResponse
    {
        $cards = $column->cards()->with('tags', 'tasks')->get();

        return response()->json($cards);
    }
}
