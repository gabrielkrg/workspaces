<?php

namespace App\Services;

use App\Models\Kanban;
use App\Models\Column;
use App\Models\Card;
use App\Models\Task;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class KanbanCloneService
{
    /**
     * Clone a kanban with all its relationships
     *
     * @param Kanban $kanban The kanban to clone
     * @param int $workspaceId The target workspace ID
     * @param User $user The user performing the clone
     * @return Kanban The cloned kanban
     */
    public function clone(Kanban $kanban, int $workspaceId, User $user): Kanban
    {
        // Load kanban with all relationships
        $kanban->load([
            'columns.cards' => function ($query) {
                $query->with(['tasks.tags', 'tags']);
            }
        ]);

        return DB::transaction(function () use ($kanban, $workspaceId, $user) {
            // Clone the kanban
            $clonedKanban = Kanban::create([
                'name' => $kanban->name . ' (Copy)',
                'workspace_id' => $workspaceId,
                'user_id' => $user->id,
            ]);

            // Clone columns and get mapping
            $columnMap = $this->cloneColumns($kanban, $clonedKanban);

            // Map old tag IDs to new tag IDs (workspace destination tags)
            $tagMap = [];

            // Clone cards, tasks and their relationships
            $this->cloneCardsAndTasks($kanban, $clonedKanban, $columnMap, $workspaceId, $user, $tagMap);

            return $clonedKanban;
        });
    }

    /**
     * Clone columns and return mapping of old IDs to new IDs
     *
     * @param Kanban $originalKanban
     * @param Kanban $clonedKanban
     * @return array
     */
    private function cloneColumns(Kanban $originalKanban, Kanban $clonedKanban): array
    {
        $columnMap = [];

        foreach ($originalKanban->columns as $column) {
            $clonedColumn = Column::create([
                'name' => $column->name,
                'kanban_id' => $clonedKanban->id,
                'order' => $column->order,
            ]);
            $columnMap[$column->id] = $clonedColumn->id;
        }

        return $columnMap;
    }

    /**
     * Clone cards, tasks and their relationships
     *
     * @param Kanban $originalKanban
     * @param Kanban $clonedKanban
     * @param array $columnMap
     * @param int $workspaceId
     * @param User $user
     * @param array $tagMap
     * @return void
     */
    private function cloneCardsAndTasks(
        Kanban $originalKanban,
        Kanban $clonedKanban,
        array $columnMap,
        int $workspaceId,
        User $user,
        array &$tagMap
    ): void {
        $cardMap = [];
        $taskMap = [];

        foreach ($originalKanban->columns as $column) {
            foreach ($column->cards as $card) {
                // Ensure tasks relationship is loaded
                if (!$card->relationLoaded('tasks')) {
                    $card->load('tasks.tags');
                }

                // Clone the card
                $clonedCard = Card::create([
                    'title' => $card->title,
                    'description' => $card->description,
                    'order' => $card->order,
                    'kanban_id' => $clonedKanban->id,
                    'column_id' => $columnMap[$card->column_id],
                    'workspace_id' => $workspaceId,
                    'user_id' => $user->id,
                    'client_id' => $card->client_id,
                ]);
                $cardMap[$card->id] = $clonedCard->id;

                // Clone tasks associated with the card
                // Use getRelation to access the relation directly from the relations array
                // This ensures we get the already loaded relation instead of triggering lazy loading
                $cardTasks = $card->relationLoaded('tasks')
                    ? $card->getRelation('tasks')
                    : $card->tasks()->with('tags')->get();

                if ($cardTasks && $cardTasks->isNotEmpty()) {
                    foreach ($cardTasks as $task) {
                        // Ensure task tags are loaded
                        if (!$task->relationLoaded('tags')) {
                            $task->load('tags');
                        }

                        if (!isset($taskMap[$task->id])) {
                            $clonedTask = $this->cloneTask($task, $workspaceId, $user, $clonedKanban->id, $tagMap);
                            $taskMap[$task->id] = $clonedTask->id;
                        }

                        // Link cloned card to cloned task via model_task pivot
                        $this->linkCardToTask($clonedCard->id, $taskMap[$task->id]);
                    }
                }

                // Ensure tags relationship is loaded
                if (!$card->relationLoaded('tags')) {
                    $card->load('tags');
                }

                // Clone card tags
                if ($card->tags && $card->tags->isNotEmpty()) {
                    $this->cloneTags($card->tags, $clonedCard->id, Card::class, $workspaceId, $user, $tagMap);
                }
            }
        }
    }

    /**
     * Clone a task and its tags
     *
     * @param Task $task
     * @param int $workspaceId
     * @param User $user
     * @param int $kanbanId
     * @param array $tagMap
     * @return Task
     */
    private function cloneTask(Task $task, int $workspaceId, User $user, int $kanbanId, array &$tagMap): Task
    {
        $clonedTask = Task::create([
            'title' => $task->title,
            'description' => $task->description,
            'repeat' => $task->repeat,
            'highlight' => $task->highlight,
            'done' => false, // Reset done status for cloned tasks
            'delete_after' => $task->delete_after,
            'user_id' => $user->id,
            'workspace_id' => $workspaceId,
            'client_id' => $task->client_id,
            'kanban_id' => $kanbanId,
        ]);

        // Clone task tags
        if ($task->tags && $task->tags->isNotEmpty()) {
            $this->cloneTags($task->tags, $clonedTask->id, Task::class, $workspaceId, $user, $tagMap);
        }

        return $clonedTask;
    }

    /**
     * Clone tags for a model - creates tags in destination workspace if they don't exist
     *
     * @param \Illuminate\Database\Eloquent\Collection $tags
     * @param int $modelId
     * @param string $modelType
     * @param int $workspaceId
     * @param User $user
     * @param array $tagMap
     * @return void
     */
    private function cloneTags($tags, int $modelId, string $modelType, int $workspaceId, User $user, array &$tagMap): void
    {
        foreach ($tags as $tag) {
            // Check if we already mapped this tag
            if (!isset($tagMap[$tag->id])) {
                // Try to find existing tag in destination workspace with same name
                $existingTag = Tag::where('workspace_id', $workspaceId)
                    ->where('name', $tag->name)
                    ->first();

                if ($existingTag) {
                    // Use existing tag from destination workspace
                    $tagMap[$tag->id] = $existingTag->id;
                } else {
                    // Create new tag in destination workspace
                    $newTag = Tag::create([
                        'name' => $tag->name,
                        'color' => $tag->color,
                        'workspace_id' => $workspaceId,
                        'user_id' => $user->id,
                    ]);
                    $tagMap[$tag->id] = $newTag->id;
                }
            }

            // Link the tag from destination workspace to the cloned model
            DB::table('taggables')->insert([
                'tag_id' => $tagMap[$tag->id],
                'taggable_id' => $modelId,
                'taggable_type' => $modelType,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Link a card to a task via model_task pivot table
     *
     * @param int $cardId
     * @param int $taskId
     * @return void
     */
    private function linkCardToTask(int $cardId, int $taskId): void
    {
        DB::table('model_task')->insert([
            'model_id' => $cardId,
            'model_type' => Card::class,
            'task_id' => $taskId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
