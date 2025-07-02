<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TimeTrackingController extends Controller
{
    public function getTrackablesTypes(): JsonResponse
    {
        return response()->json([
            'types' => TimeTracking::$types,
        ]);
    }
}
