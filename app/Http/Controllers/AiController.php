<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\JsonResponse;

class AiController extends Controller
{
    public function generateWithAi(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('API_AI_TOKEN'),
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ])->post('https://ai.gabrielk.dev/api/ai/019a159a-b497-7098-9353-4dde59275045', [
            'content' => $validated['content'],
        ]);

        return response()->json($response->json());
    }
}
