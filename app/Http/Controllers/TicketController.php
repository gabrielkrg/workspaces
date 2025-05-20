<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Ticket;
use App\Models\Workspace;
use App\Models\Client;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('view', $workspace);

        $tickets = Ticket::where('workspace_id', $user->workspace_id)->get();
        $clients = Client::where('workspace_id', $user->workspace_id)->get();

        return Inertia::render('Ticket/Index', [
            'tickets' => $tickets,
            'clients' => $clients,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'client_id' => 'nullable|exists:clients,id',
        ]);

        $request->merge([
            'user_id' => $user->id,
            'workspace_id' => $workspace->id,
        ]);

        $ticket = Ticket::create($request->all());

        return redirect()->route('tickets.index')->with('success', 'Ticket created successfully');
    }

    public function update(Request $request, Ticket $ticket)
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $ticket->update($request->all());

        return redirect()->route('tickets.index')->with('success', 'Ticket updated successfully');
    }

    public function destroy(Ticket $ticket)
    {
        $user = Auth::user();

        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('update', $workspace);

        $ticket->delete();

        return redirect()->route('tickets.index')->with('success', 'Ticket deleted successfully');
    }
}
