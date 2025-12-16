<script setup lang="ts">
import { Calendar, ListTodo } from 'lucide-vue-next';
import { computed } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-vue-next';

interface Task {
    id: number;
    title: string;
    description: string;
    done: boolean;
}

interface Tag {
    id: number;
    name: string;
    color: string;
}

interface Card {
    id: number;
    title: string;
    description: string;
    tasks: Task[];
    tags: Tag[];
}

const props = defineProps<{
    card: Card;
}>();

const doneTasks = computed(() => props.card.tasks.filter((task: Task) => task.done).length);
const totalTasks = computed(() => props.card.tasks.length);
</script>

<template>
    <Card class="cursor-pointer gap-2 p-5">
        <CardHeader class="flex flex-col space-y-1 p-0">
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
        </CardHeader>
        <CardContent class="p-0">
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