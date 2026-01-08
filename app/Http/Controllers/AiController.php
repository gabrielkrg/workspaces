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
        ])->post('https://agents.gabrielk.dev/api/gemini/generate/single', [
            'agent_uuid' => '019afd16-a1f0-7193-8e4b-bb09e4bb6310',
            'content' => $validated['content'],
        ]);

        return response()->json($response->json());
    }
}
