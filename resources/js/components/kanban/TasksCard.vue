<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check, Trash2 } from 'lucide-vue-next';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { router, useForm } from '@inertiajs/vue3';
import TasksCardEdit from '@/components/kanban/tasksCardEdit.vue';
import axios from 'axios';
import type { KanbanCard } from '@/types';

const props = defineProps<{
    card: KanbanCard;
}>();


// task
const form = useForm({
    title: '',
    description: '',
    done: false,
});

const updateCardTasks = async (card: Card) => {
    const response = await axios.get(route('cards.get.tasks', { card: card.id }));
    card.tasks = response.data.tasks;
}

const attachTask = () => {
    form.post(route('cards.attach.task', {
        card: props.card.id,
        client_id: props.card.client_id || null,
        kanban_id: props.card.kanban_id,
        tags: props.card.tags.map((tag: any) => tag.name) || [],
    }), {
        onSuccess: () => {
            updateCardTasks(props.card);
            form.reset();
        },
        onError: (errors) => {
            console.log('Error attaching task:', errors);
        }
    });
}

const updateTask = (task: any, updates: Partial<any>) => {
    router.put(route('tasks.update', task.id), { ...updates }, {
        onSuccess: () => {
            updateCardTasks(props.card);
        }
    });
};

const deleteTask = (taskId: number) => {
    router.delete(route('tasks.delete', taskId), {
        onSuccess: () => {
            updateCardTasks(props.card);
        }
    });
}
</script>

<template>
    <div class="grid gap-2">
        <Label for="tasks" class="text-sm font-medium">Tasks</Label>
        <div v-for="task in card.tasks" :key="task.id">
            <div class="group flex justify-between items-center gap-4 border-b py-1">
                <div class="flex items-center gap-2">
                    <label class="inline-flex cursor-pointer items-center">
                        <input type="checkbox" :checked="task.done" @change="updateTask(task, { done: !task.done })"
                            class="peer sr-only" />
                        <div
                            class="flex h-5 w-5 items-center justify-center rounded border-2 border-gray-300 transition-colors duration-300 peer-checked:border-green-600 peer-checked:bg-green-600">
                            <Check v-if="task.done" class="h-4 w-4 text-white" />
                        </div>
                    </label>

                    <h3 :class="{ 'line-through': task.done }">
                        {{ task.title }}
                    </h3>
                </div>

                <div class="flex items-center gap-2">
                    <TasksCardEdit :task="task" @update="updateCardTasks(card)" />
                    <Dialog>
                        <DialogTrigger as-child>
                            <Button variant="destructive" type="button" size="icon">
                                <Trash2 class="w-4 h-4" />
                            </Button>
                        </DialogTrigger>

                        <DialogContent>
                            <form class="space-y-6" @submit.prevent="deleteTask(task.id)">
                                <DialogHeader class="space-y-3">
                                    <DialogTitle>Are you sure you want to delete this task?
                                    </DialogTitle>
                                    <DialogDescription>
                                        Once your task is deleted, there's no way to recover
                                        it.
                                    </DialogDescription>
                                </DialogHeader>

                                <DialogFooter class="gap-2">
                                    <DialogClose as-child>
                                        <Button variant="secondary" type="button">Cancel</Button>
                                    </DialogClose>

                                    <Button variant="destructive" :disabled="form.processing" type="submit">
                                        Delete task
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>

        <Dialog>
            <DialogTrigger as-child>
                <Button variant="outline">
                    Add Task
                </Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Task</DialogTitle>
                    <DialogDescription>
                        Add a new task to your card.
                    </DialogDescription>
                </DialogHeader>
                <form @submit.prevent="attachTask">
                    <div class="grid gap-4 py-4">
                        <div class="grid grid-cols-4 items-center gap-4">
                            <Label for="title" class="text-right">
                                Title
                            </Label>
                            <Input id="title" v-model="form.title" class="col-span-3" />
                        </div>
                        <div class="grid grid-cols-4 items-center gap-4">
                            <Label for="description" class="text-right">
                                Description
                            </Label>
                            <Textarea id="description" v-model="form.description" class="col-span-3" />
                        </div>
                    </div>

                    <DialogFooter class="gap-2 flex justify-end">
                        <DialogClose as-child>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <DialogClose as-child>
                            <Button type="submit">
                                Save changes
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        <span class="text-xs text-gray-500">
            Tasks created from here will have the tags and client of the card
        </span>
    </div>
</template>