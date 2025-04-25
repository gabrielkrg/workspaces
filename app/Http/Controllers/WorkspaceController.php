<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkspaceController extends Controller
{

    public function index()
    {
        return Inertia::render('Workspace/Index');
    }

    public function store(Request $request)
    {
        dd($request->all());
    }
}
