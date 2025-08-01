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
            'Authorization' => 'Bearer ' . env('AI_API_TOKEN'),
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ])->post('https://ai.gabrielk.dev/api/ai/01980fd9-01d7-71f2-816b-4ce99b7e6151', [
            'content' => $validated['content'],
        ]);

        return response()->json($response->json());
    }
}
