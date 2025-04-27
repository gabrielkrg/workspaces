<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/vue3';
import { Check, EllipsisVertical } from 'lucide-vue-next';
import { PopoverClose, PopoverContent, PopoverRoot, PopoverTrigger } from 'reka-ui';
import { computed, onMounted, onUnmounted, ref } from 'vue';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Daily Tasks',
        href: '/tasks',
    },
];

const props = defineProps({
    tasks: Array,
});

const form = useForm({
    title: '',
    description: '',
});

const submit = () => {
    form.post(route('tasks.store'), {
        onSuccess: () => {
            form.reset();
        },
    });
};

const activeMenu = ref(null);
const menuRef = ref(null);

const handleClickOutside = (event) => {
    if (menuRef.value && !menuRef.value.contains(event.target)) {
        activeMenu.value = null;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

const selectedTask = ref(null);

const updateForm = useForm({
    title: '',
    description: '',
});

const selectTask = (task) => {
    selectedTask.value = task;

    updateForm.title = task.title;
    updateForm.description = task.description;
};

const update = (taskId) => {
    if (selectedTask.value == null) return;

    console.log(selectedTask.value);
    updateForm.put(route('tasks.update', taskId), {
        onSuccess: () => {
            updateForm.reset();
        },
    });
};

const completed = computed(() => props.tasks.filter((t) => t.done).length);
const total = computed(() => props.tasks.length);
const percent = computed(() => (total.value ? Math.round((completed.value / total.value) * 100) : 0));

const updateTask = (task, updates) => {
    router.put(route('tasks.update', task.id), updates, {
        preserveScroll: true,
        onSuccess: (page) => {
            const updatedTask = page.props.tasks.find((t) => t.id === task.id);

            if (updatedTask) {
                task.title = updatedTask.title;
                task.done = updatedTask.done;
            }
        },
        onError: (errors) => {
            console.log('Erro ao atualizar tarefa:', errors);
        },
    });
};

const deleteTask = (taskId) => {
    router.delete(route('tasks.delete', taskId), {
        preserveScroll: true,
        onSuccess: () => closeModal(),
        onError: (errors) => {
            console.log('Erro ao atualizar tarefa:', errors);
        },
    });
};

const closeModal = () => {};
</script>

<template>
    <Head title="Daily Tasks" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div class="flex items-end justify-between gap-4">
                <!-- progress -->
                <div class="w-full max-w-md">
                    <div class="w-full max-w-md" v-if="tasks.length > 0">
                        <div class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Progress: {{ percent }}%</div>

                        <div class="bg-sidebar-accent h-4 w-full overflow-hidden rounded-full shadow-md">
                            <div class="h-full bg-green-500 transition-all duration-300 ease-in-out" :style="{ width: `${percent}%` }" />
                        </div>
                    </div>
                </div>

                <Sheet>
                    <SheetTrigger as-child>
                        <Button variant="default"> Create </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <form @submit.prevent="submit">
                            <SheetHeader>
                                <SheetTitle>Create task</SheetTitle>
                                <SheetDescription> Fill the fields to create a new task. Click save when you're done. </SheetDescription>
                            </SheetHeader>
                            <div class="grid gap-4 p-4">
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="title" class="text-right"> Title </Label>
                                    <Input id="title" v-model="form.title" class="col-span-4" />
                                </div>

                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="description" class="text-right"> Description </Label>
                                    <Textarea
                                        id="description"
                                        v-model="form.description"
                                        placeholder="Type your description here."
                                        class="col-span-4"
                                    />
                                </div>
                            </div>
                            <SheetFooter>
                                <SheetClose as-child>
                                    <Button type="submit"> Save </Button>
                                </SheetClose>
                            </SheetFooter>
                        </form>
                    </SheetContent>
                </Sheet>
            </div>

            <div class="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min">
                <div class="p-5">
                    <!-- tasks -->
                    <div v-if="tasks.length > 0">
                        <ul class="space-y-2 divide-y">
                            <li v-for="task in tasks" :key="task.id" class="flex items-center justify-between gap-4 p-4">
                                <div class="flex items-start gap-4">
                                    <label class="group mt-2 inline-flex cursor-pointer items-center">
                                        <input
                                            type="checkbox"
                                            :checked="task.done"
                                            @change="updateTask(task, { done: !task.done })"
                                            class="peer sr-only"
                                        />
                                        <div
                                            class="flex h-5 w-5 items-center justify-center rounded border-2 border-gray-300 transition-colors duration-300 peer-checked:border-green-600 peer-checked:bg-green-600"
                                        >
                                            <Check v-if="task.done" class="h-4 w-4 text-white" />
                                        </div>
                                    </label>

                                    <div :class="['text-gray-700 dark:text-gray-300', { 'line-through': task.done }]">
                                        <h2 class="line-clamp text-lg font-semibold text-gray-900 dark:text-white">{{ task.title }}</h2>
                                        <p class="line-clamp text-gray-700 dark:text-gray-300">{{ task.description }}</p>
                                    </div>
                                </div>

                                <PopoverRoot class="relative">
                                    <PopoverTrigger as-child>
                                        <button class="cursor-pointer p-2">
                                            <EllipsisVertical class="m-5 h-5 w-5 text-gray-900 dark:text-white" />
                                        </button>
                                    </PopoverTrigger>

                                    <PopoverContent class="bg-sidebar absolute right-5 z-50 mt-2 w-40 overflow-hidden rounded shadow" align="end">
                                        <PopoverClose as-child>
                                            <Sheet>
                                                <SheetTrigger as-child>
                                                    <div
                                                        @click="selectTask(task)"
                                                        class="dark:hover:bg-muted block w-full px-4 py-2 text-left hover:bg-gray-100"
                                                    >
                                                        Edit
                                                    </div>
                                                </SheetTrigger>
                                                <SheetContent>
                                                    <form @submit.prevent="update(task)">
                                                        <SheetHeader>
                                                            <SheetTitle> Edit task </SheetTitle>
                                                            <SheetDescription> Click save when you're done. </SheetDescription>
                                                        </SheetHeader>
                                                        <div class="grid gap-4 p-4">
                                                            <div class="grid grid-cols-4 items-center gap-4">
                                                                <Label for="title" class="text-right"> Title </Label>
                                                                <Input id="title" v-model="updateForm.title" class="col-span-4" />
                                                            </div>

                                                            <div class="grid grid-cols-4 items-center gap-4">
                                                                <Label for="description" class="text-right"> Description </Label>
                                                                <Textarea id="description" v-model="updateForm.description" class="col-span-4" />
                                                            </div>
                                                        </div>
                                                        <SheetFooter>
                                                            <SheetClose as-child>
                                                                <Button type="submit"> Save changes </Button>
                                                            </SheetClose>
                                                        </SheetFooter>
                                                    </form>
                                                </SheetContent>
                                            </Sheet>
                                        </PopoverClose>

                                        <Dialog>
                                            <DialogTrigger as-child>
                                                <div
                                                    class="block w-full cursor-pointer px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                                                    variant="destructive"
                                                >
                                                    Delete
                                                </div>
                                            </DialogTrigger>

                                            <DialogContent>
                                                <form class="space-y-6" @submit.prevent="deleteTask(task.id)">
                                                    <DialogHeader class="space-y-3">
                                                        <DialogTitle>Are you sure you want to delete this task?</DialogTitle>
                                                        <DialogDescription>
                                                            Once your task is deleted, there’s no way to recover it.
                                                        </DialogDescription>
                                                    </DialogHeader>

                                                    <DialogFooter class="gap-2">
                                                        <DialogClose as-child>
                                                            <Button variant="secondary">Cancel</Button>
                                                        </DialogClose>

                                                        <Button variant="destructive" :disabled="form.processing">
                                                            <button type="submit">Delete task</button>
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </PopoverContent>
                                </PopoverRoot>
                            </li>
                        </ul>
                    </div>
                    <div v-else>
                        <p class="text-gray-800 dark:text-gray-100">There are no tasks yet</p>
                    </div>
                </div>
                <!-- <PlaceholderPattern /> -->
            </div>
        </div>
    </AppLayout>
</template>

<style scoped>
.line-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
