<?php

namespace Database\Seeders;

use App\Models\TimeTracking;
use App\Models\Workspace;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class UpdateElapsedTimeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TimeTracking::query()
            ->whereNotNull('start_time')
            ->whereNotNull('end_time')
            ->chunkById(500, function ($trackings) {

                foreach ($trackings as $tracking) {
                    $workspace = Workspace::find($tracking->workspace_id);

                    if (!$workspace) {
                        continue;
                    }

                    $start = Carbon::parse($tracking->start_time, 'UTC');
                    $end   = Carbon::parse($tracking->end_time, 'UTC');

                    if ($end->lessThanOrEqualTo($start)) {
                        continue;
                    }

                    $elapsedSeconds = $start->diffInSeconds($end);

                    $tracking->updateQuietly([
                        'elapsed_time' => $elapsedSeconds,
                        'is_running' => false,
                    ]);
                }
            });
    }
}
