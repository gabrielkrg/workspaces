<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user()->load('workspace.tasks');

        $workspaces = $user->workspaces()
            ->select('workspaces.id', 'workspaces.name')
            ->withCount('tasks')
            ->withCount('tickets')
            ->withCount('clients')
            ->get();

        return Inertia::render('Dashboard', [
            'user' => $user,
            'workspaces' => $workspaces,
        ]);
    }
}
