<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

interface Task {
    id: number;
    title: string;
    workspace: {
        name: string;
    };
    updated_at_formatted: string;
}

const tasks = ref<Task[]>([]);

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

    <Table>
        <TableHeader>
            <TableRow>
                <TableHead class="w-[100px]">
                    Status
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Workspace</TableHead>
                <TableHead class="text-right">
                    Updated at
                </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow v-for="task in tasks" :key="task.id">
                <TableCell class="font-medium">
                    {{ task.done ? 'Done' : 'To do' }}
                </TableCell>
                <TableCell>{{ task.title }}</TableCell>
                <TableCell>{{ task.workspace.name }}</TableCell>
                <TableCell class="text-right">
                    {{ task.updated_at_formatted }}
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>

</template>