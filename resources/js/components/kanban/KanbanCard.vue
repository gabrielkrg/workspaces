<script setup lang="ts">
import { Calendar, ListTodo } from 'lucide-vue-next';
import { computed } from 'vue';

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

const props = defineProps<{
    card: any;
}>();

const doneTasks = computed(() => props.card.tasks.filter(task => task.done).length);
const totalTasks = computed(() => props.card.tasks.length);
</script>

<template>
    <div
        class="cursor-pointer rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow bg-sidebar dark:text-white text-black">
        <div class="flex gap-2 flex-col">
            <div v-if="card.tags.length > 0" class="flex items-center gap-2 flex-wrap">
                <div v-for="tag in card.tags" :key="tag.id">
                    <div class="flex rounded bg-gray-400 px-1 text-xs font-normal text-white capitalize"
                        :style="tag.color ? { backgroundColor: tag.color } : { backgroundColor: '#9ca3af' }">
                        {{ tag.name }}
                    </div>
                </div>
            </div>
            <h4 class="font-medium">{{ card.title }}</h4>
        </div>

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
    </div>
</template>