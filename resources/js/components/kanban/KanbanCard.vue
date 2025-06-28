<script setup lang="ts">
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
    title: string;
    description: string;
    tasks: Task[];
    tags: Tag[];
}>();

const doneTasks = computed(() => props.tasks.filter(task => task.done).length);
const totalTasks = computed(() => props.tasks.length);
</script>

<template>
    <div
        class="cursor-pointer rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow bg-sidebar dark:text-white text-black">
        <h4 class="font-medium">{{ title }}</h4>
        <p class="text-sm text-sidebar-accent-foreground">{{ description }}</p>
        <div class="flex flex-col gap-2 mt-2" v-if="tasks && tasks.length > 0">
            <p class="text-sm"><span class="font-medium capitalize text-sidebar-accent-foreground">Tasks:</span>
                {{ doneTasks }}/{{ totalTasks }}</p>
        </div>
    </div>
</template>