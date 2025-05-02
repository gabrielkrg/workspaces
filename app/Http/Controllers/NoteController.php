<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Note;
use App\Models\Workspace;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class NoteController extends Controller
{
    use AuthorizesRequests;
    public function index(Request $request) {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('view', $workspace);

        $notes = Note::where('user_id', $user->id)->where('workspace_id', $user->workspace_id)->get();
        
        $currentNote = $notes->first();

        if ($request->has('note')) {
            $currentNote = Note::find($request->note);
        }

        return Inertia::render('Note/Index', [
            'notes' => $notes,
            'currentNote' => $currentNote,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
        ]);

        $request->merge([
            'workspace_id' => $user->workspace_id,
            'user_id' => $user->id,
        ]);
    
        $note = Note::create($request->all());
    
        return redirect()->route('notes.index', ['note' => $note->id]);
    }

    public function update(Request $request, Note $note)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
        ]);

        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $note->update($data);

        return redirect()->back()->with('success', 'Note updated!');
    }

    public function delete(Note $note)
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('delete', $workspace);

        $note->delete();
        return redirect()->route('notes.index')->with('success', 'Note deleted successfully');
    }
}
