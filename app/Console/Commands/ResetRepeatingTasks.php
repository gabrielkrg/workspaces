<?php

namespace App\Console\Commands;

use App\Models\Task;
use App\Models\Workspace;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ResetRepeatingTasks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reset:repeating-tasks';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset the status of the tasks based on the repeat';

    public function handle()
    {
        $workspaces = Workspace::whereNotNull('time_zone')->get();

        foreach ($workspaces as $workspace) {
            $now = now($workspace->time_zone);

            // Resetar tarefas diárias (meia-noite no timezone do workspace)
            if ($now->format('H:i') === '00:00') {
                Task::where('workspace_id', $workspace->id)
                    ->where('repeat', 'daily')
                    ->update(['done' => false]);
            }

            // Resetar tarefas semanais (toda segunda-feira no timezone do workspace)
            if ($now->isMonday() && $now->format('H:i') === '00:00') {
                Task::where('workspace_id', $workspace->id)
                    ->where('repeat', 'weekly')
                    ->update(['done' => false]);
            }

            // Resetar tarefas mensais (dia 1 do mês no timezone do workspace)
            if ($now->isSameDay($now->copy()->startOfMonth()) && $now->format('H:i') === '00:00') {
                Task::where('workspace_id', $workspace->id)
                    ->where('repeat', 'monthly')
                    ->update(['done' => false]);
            }
        }

        $this->info('Repeat tasks reset according to workspace time zones.');
    }
}
