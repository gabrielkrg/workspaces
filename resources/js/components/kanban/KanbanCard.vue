<script setup lang="ts">
import { Calendar, ListTodo } from 'lucide-vue-next';
import { computed } from 'vue';
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import type { KanbanCard, Task } from '@/types';
import StartTimer from '@/components/StartTimer.vue';

const props = defineProps<{
    card: KanbanCard;
}>();

const doneTasks = computed(() => props.card.tasks.filter((task: Task) => task.done).length);
const totalTasks = computed(() => props.card.tasks.length);

</script>

<template>
    <Card class="cursor-pointer">
        <CardHeader>
            <div v-if="card.tags.length > 0" class="flex items-center gap-2 flex-wrap">
                <div v-for="tag in card.tags" :key="tag.id">
                    <div class="flex rounded bg-primary px-1 text-xs font-normal text-primary-foreground capitalize"
                        :style="tag.color ? { backgroundColor: tag.color } : { backgroundColor: '#9ca3af' }">
                        {{ tag.name }}
                    </div>
                </div>
            </div>
            <CardTitle class="font-medium ellipsis">
                {{ card.title }}
            </CardTitle>
            <CardAction>
                <StartTimer :trackable_id="card.id" :trackable_type="'App\\Models\\Card'" />
            </CardAction>
        </CardHeader>
        <CardContent>
            <p class="text-sm text-sidebar-accent-foreground ellipsis">{{ card.description }}</p>

            <div class="flex flex-col gap-1 mt-2">
                <div class="flex items-center gap-2" v-if="card.tasks && card.tasks.length > 0">
                    <ListTodo class="w-4 h-4" />
                    <p class="text-sm text-sidebar-accent-foreground">
                        {{ doneTasks }}/{{ totalTasks }}
                    </p>
                </div>

                <div class="flex items-center gap-2">
                    <Calendar class="w-4 h-4" />
                    <p class="text-sm text-sidebar-accent-foreground">
                        {{ card.created_at_formatted }}
                    </p>
                </div>
            </div>
        </CardContent>
    </Card>
</template>