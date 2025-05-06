<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Column;
use App\Models\Kanban;
use App\Models\Workspace;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CardController extends Controller
{
    use AuthorizesRequests;

    public function store(Request $request, Kanban $kanban)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'column_id' => 'required|exists:columns,id',
            'order' => 'required|integer',
        ]);

        $user = Auth::user();
        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $card = Card::create([
            'title' => $request->title,
            'description' => $request->description,
            'column_id' => $request->column_id,
            'kanban_id' => $kanban->id,
            'workspace_id' => $workspace->id,
            'user_id' => $user->id,
            'order' => $request->order,
        ]);

        return redirect()->route('kanban.show', $kanban->id)->with('success', 'Card created successfully');
    }
    
    public function update(Request $request, Card $card)
    {
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'order' => 'sometimes|integer',
            'column_id' => 'sometimes|exists:columns,id',
        ]);

        $user = Auth::user();
        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $card->update([
            'title' => $request->title,
            'description' => $request->description,
            'order' => $request->order,
            'column_id' => $request->column_id,
        ]);

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



}
