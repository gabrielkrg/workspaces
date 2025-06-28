<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MigrateTagTaskToTaggablesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $records = DB::table('tag_task')->get();

        foreach ($records as $record) {
            DB::table('taggables')->insert([
                'tag_id' => $record->tag_id,
                'taggable_id' => $record->task_id,
                'taggable_type' => 'App\\Models\\Task',
                'created_at' => $record->created_at,
                'updated_at' => $record->updated_at,
            ]);
        }
    }
}
