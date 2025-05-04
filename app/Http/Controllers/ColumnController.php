<?php

namespace App\Http\Controllers;

use App\Models\Column;
use App\Models\Kanban;
use App\Models\Workspace;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

    public function reorder(Request $request, Kanban $kanban)
    {
        $request->validate([
            'columns' => 'required|array',
            'columns.*.id' => 'required|exists:columns,id',
            'columns.*.order' => 'required|integer',
        ]);

        $user = Auth::user();
        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        foreach ($request->columns as $columnData) {
            Column::where('id', $columnData['id'])
                ->where('kanban_id', $kanban->id)
                ->update(['order' => $columnData['order']]);
        }

        return response()->json(['success' => true]);
    }
}
