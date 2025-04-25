<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WorkspaceController extends Controller
{
    public function index()
        {
            $user = Auth::user();
            $workspaces = $user->workspaces()->latest()->get();

            return response()->json($workspaces);
        }
}
