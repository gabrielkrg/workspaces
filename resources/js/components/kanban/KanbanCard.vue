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
    description: string | null;
    tasks: Task[];
    tags: Tag[];
}>();

const doneTasks = computed(() => props.tasks.filter(task => task.done).length);
const totalTasks = computed(() => props.tasks.length);
</script>

<template>
    <div
        class="cursor-pointer rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow bg-sidebar dark:text-white text-black">
        <div class="flex gap-2 flex-col">
            <div v-if="tags.length > 0" class="flex items-center gap-2 flex-wrap">
                <div v-for="tag in tags" :key="tag.id">
                    <div class="flex rounded bg-gray-400 px-1 text-xs font-normal text-white capitalize"
                        :style="tag.color ? { backgroundColor: tag.color } : { backgroundColor: '#9ca3af' }">
                        {{ tag.name }}
                    </div>
                </div>
            </div>
            <h4 class="font-medium">{{ title }}</h4>
        </div>

        <p class="text-sm text-sidebar-accent-foreground">{{ description }}</p>

        <div class="flex flex-col gap-2 mt-2" v-if="tasks && tasks.length > 0">
            <p class="text-sm"><span class="font-medium capitalize text-sidebar-accent-foreground">Tasks:</span>
                {{ doneTasks }}/{{ totalTasks }}</p>
        </div>
    </div>
</template>