<script setup lang="ts">
import HeadingSmall from '@/components/HeadingSmall.vue';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';
import { CheckIcon, Circle } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';

const title = ref('Latest changes');
const description = ref('Here you can see the latest changes for tasks of all workspaces');

const tasks = ref([]);

onMounted(async () => {
    try {
        const response = await axios.get(route('tasks.latest'));
        tasks.value = response.data;
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
    }
});
</script>
<template>
    <div class="flex flex-col text-center">
        <HeadingSmall :title="title" :description="description" class="mb-5" />

        <Card>
            <CardContent class="p-0">
                <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                    <thead class="bg-gray-100 text-xs text-gray-700 uppercase dark:bg-gray-800 dark:text-gray-300">
                        <tr>
                            <th class="px-4 py-3">Status</th>
                            <th class="px-4 py-3">Title</th>
                            <th class="px-4 py-3">Workspace</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="task in tasks"
                            :key="task.id"
                            class="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                            <td class="px-4 py-3">
                                <CheckIcon v-if="task.done" class="h-5 w-5 text-green-500" />
                                <Circle class="h-4 w-4 text-gray-400" v-else />
                            </td>
                            <td class="px-4 py-3">
                                <span :class="{ 'text-gray-400 line-through': task.done }">
                                    {{ task.title }}
                                </span>
                            </td>
                            <td class="px-4 py-3">{{ task.workspace.name }}</td>
                        </tr>
                    </tbody>
                </table>
            </CardContent>
        </Card>
    </div>
</template>
