<script setup lang="ts">
import EditTaskModal from '@/components/EditTaskModal.vue';
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

const showCreateModal = ref(false);

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

    showCreateModal.value = false;
};

const activeMenu = ref(null);
const menuRef = ref(null);

const toggleMenu = (taskId) => {
    activeMenu.value = activeMenu.value === taskId ? null : taskId;
};

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
const showEditModal = ref(false && selectedTask.value != null);

const closeEditModal = () => {
    showEditModal.value = false;
};

const editTask = (task) => {
    activeMenu.value = null;
    selectedTask.value = task;
    showEditModal.value = true;
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

    <EditTaskModal :task="selectedTask" v-if="showEditModal" @close="closeEditModal" />

    <!-- create modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-end">
        <div class="absolute inset-0 bg-black opacity-60" @click="showCreateModal = false"></div>
        <div
            class="border-sidebar-border/70 dark:border-sidebar-border bg-background relative z-50 h-full w-4/5 rounded-l-xl rounded-bl-xl border md:w-2/5"
        >
            <div class="p-5">
                <h2 class="text-lg font-bold text-gray-800 dark:text-gray-100">Create Task</h2>
                <!-- <p class="text-gray-800 dark:text-gray-100">Este texto é escuro no tema claro e claro no tema escuro.</p> -->

                <form @submit.prevent="submit" class="space-y-4">
                    <div>
                        <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <input
                            id="title"
                            v-model="form.title"
                            type="text"
                            class="border-sidebar-border/70 dark:border-sidebar-border bg-background mt-1 block w-full rounded border p-2 dark:text-white"
                        />
                        <p v-if="form.errors.title" class="mt-1 text-sm text-red-500">{{ form.errors.title }}</p>
                    </div>

                    <div>
                        <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                            id="description"
                            v-model="form.description"
                            class="border-sidebar-border/70 dark:border-sidebar-border bg-background mt-1 block w-full rounded border p-2 dark:text-white"
                        />
                        <p v-if="form.errors.description" class="mt-1 text-sm text-red-500">{{ form.errors.description }}</p>
                    </div>

                    <button
                        type="submit"
                        :disabled="form.processing"
                        class="cursor-pointer rounded bg-green-600 px-4 py-2 text-white transition hover:bg-green-700 disabled:opacity-50"
                    >
                        {{ form.processing ? 'Saving...' : 'Save' }}
                    </button>
                </form>
            </div>
        </div>
    </div>
    <!-- create modal -->

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div class="flex justify-between gap-4">
                <!-- progress -->
                <div class="w-full max-w-md">
                    <div class="w-full max-w-md" v-if="tasks.length > 0">
                        <div class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Progress: {{ percent }}%</div>

                        <div class="bg-sidebar-accent h-4 w-full overflow-hidden rounded-full shadow-md">
                            <div class="h-full bg-green-500 transition-all duration-300 ease-in-out" :style="{ width: `${percent}%` }" />
                        </div>
                    </div>
                </div>

                <button
                    class="inline-flex cursor-pointer items-center rounded-xl bg-green-600 px-6 py-2.5 font-semibold text-white shadow-md transition-all duration-300 hover:bg-green-700 hover:shadow-lg focus:ring-4 focus:ring-green-300 focus:outline-none dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-600"
                    @click="showCreateModal = !showCreateModal"
                >
                    Create
                </button>
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
                                            <button
                                                @click="editTask(task)"
                                                class="dark:hover:bg-muted block w-full px-4 py-2 text-left hover:bg-gray-100"
                                            >
                                                Edit
                                            </button>
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
                        <p class="text-gray-800 dark:text-gray-100">There are no tasks yet!</p>
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
