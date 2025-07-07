<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use App\Models\Workspace;
use Illuminate\Http\JsonResponse;

class TagController extends Controller
{
    use AuthorizesRequests;

    public function index(): JsonResponse
    {
        $user = Auth::user();
        $workspace = Workspace::findOrFail($user->workspace_id);

        $this->authorize('view', $workspace);

        $tags = $workspace->tags()->orderBy('created_at', 'desc')->get();

        return response()->json($tags);
    }
}
