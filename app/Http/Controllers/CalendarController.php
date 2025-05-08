<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class CalendarController extends Controller
{
    public function index()
    {
        $currentDate = Carbon::now();
        $weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        $firstDay = $currentDate->copy()->startOfMonth();
        $lastDay = $currentDate->copy()->endOfMonth();
        
        $days = [];
        
        // Add empty cells for days before the first day of the month
        for ($i = 0; $i < $firstDay->dayOfWeek; $i++) {
            $days[] = null;
        }
        
        // Add days of the month
        for ($i = 1; $i <= $lastDay->day; $i++) {
            $days[] = $i;
        }

        return Inertia::render('Calendar/Index', [
            'calendarData' => [
                'currentDate' => $currentDate->format('Y-m-d'),
                'currentMonth' => $currentDate->format('F Y'),
                'weekDays' => $weekDays,
                'days' => $days,
            ]
        ]);
    }
}
