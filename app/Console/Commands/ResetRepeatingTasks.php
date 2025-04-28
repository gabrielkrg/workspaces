<?php

namespace App\Console\Commands;

use App\Models\Task;
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

    /**
     * Execute the console command.
     */
     public function handle()
     {
         // Resetar tarefas diárias
         Task::where('repeat', 'daily')
             ->update(['done' => false]);

         // Resetar tarefas mensais somente no dia 1
         if (now()->day == 1) {
             Task::where('repeat', 'monthly')
                 ->update(['done' => false]);
         }

         $this->info('Repeat tasks reseted successfully.');
         Log::info('Command tasks:reset-daily run at ' . now());
     }
}
