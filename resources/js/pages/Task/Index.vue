<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import DialogClose from '@/components/ui/dialog/DialogClose.vue';
import TaskDataTable from '@/components/TaskDataTable.vue';
import EditTask from './EditTask.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/vue3';
import { ChevronDown } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';
import TitleFilter from './Filters/TitleFilter.vue';
import TagFilter from './Filters/TagFilter.vue';
import ClientFilter from './Filters/ClientFilter.vue';
import StatusFilter from './Filters/StatusFilter.vue';
import OrderFilter from './Filters/OrderFilter.vue';

import CreateTask from './CreateTask.vue';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import HeadingLarge from '@/components/HeadingLarge.vue';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];

const props = defineProps<{
    tasks: any[],
    tags: { name: string, color: string }[],
    filters: any,
    clients: any[],
}>();

const selectedTask = ref(null);
const isEditSheetOpen = ref(false);
const isDeleteDialogOpen = ref(false);
const isFiltersOpen = ref(false);
const taskToDeleteId = ref<number | null>(null);

const selectTask = (task) => {
    selectedTask.value = task;
    isEditSheetOpen.value = true;
};

const completed = computed(() => props.tasks.filter((t) => t.done).length);
const total = computed(() => props.tasks.length);
const percent = computed(() => (total.value ? Math.round((completed.value / total.value) * 100) : 0));

const updateTask = (task, updates) => {
    // Optimistic update
    const previousState = { ...task };
    Object.assign(task, updates);

    router.put(route('tasks.update', task.id), updates, {
        preserveScroll: true,
        onError: (errors) => {
            // Revert on error
            Object.assign(task, previousState);
            console.log('Erro ao atualizar tarefa:', errors);
        },
    });
};

const isDeleting = ref(false);

const startDelete = (taskId) => {
    taskToDeleteId.value = taskId;
    isDeleteDialogOpen.value = true;
};

const deleteTask = () => {
    if (!taskToDeleteId.value) return;

    isDeleting.value = true;
    router.delete(route('tasks.delete', taskToDeleteId.value), {
        preserveScroll: true,
        onSuccess: () => {
            isDeleteDialogOpen.value = false;
            taskToDeleteId.value = null;
            router.get(route('tasks.index'), {
                preserveState: true,
                replace: true,
            });
        },
        onError: (errors) => {
            console.log('Erro ao atualizar tarefa:', errors);
        },
        onFinish: () => {
            isDeleting.value = false;
        },
    });
};


const filtersForm = useForm({
    search: props.filters?.search || '',
    tags: props.filters?.tags || [],
    done: props.filters?.done || '',
    order: props.filters?.order || '',
    client_id: props.filters?.client_id || '',
});

const submitFilters = () => {
    filtersForm.get(route('tasks.index'), {
        preserveState: true,
        replace: true,
    });
};


watch(
    () => filtersForm.tags,
    () => {
        submitFilters();
    },
    { deep: true }
);

watch(
    () => filtersForm.done,
    () => {
        submitFilters();
    },
);

watch(
    () => filtersForm.order,
    () => {
        submitFilters();
    },
    { deep: true }
);

watch(
    () => filtersForm.client_id,
    () => {
        submitFilters();
    },
);
</script>

<template>

    <Head title="Tasks" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex-1 space-y-6 md:p-8 md:pt-6 p-4 pt-2">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <HeadingLarge title="Tasks" description="Here's a list of your tasks!" />
                <CreateTask :clients="clients" :tags="tags" />
            </div>


            <div class="flex flex-wrap items-end justify-between gap-4">
                <!-- progress -->
                <div class="w-full max-w-md">
                    <div class="w-full max-w-md" v-if="tasks.length > 0">
                        <p class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Progress: {{ percent }}%
                        </p>

                        <div class="bg-sidebar-accent h-4 w-full overflow-hidden rounded-full shadow-md">
                            <div class="h-full bg-green-500 transition-all duration-300 ease-in-out"
                                :style="{ width: `${percent}%` }" />
                        </div>
                    </div>
                </div>

                <Collapsible v-model:open="isFiltersOpen" class="w-full space-y-2">
                    <CollapsibleTrigger as-child>
                        <div class="inline-flex items-center justify-between gap-2 cursor-pointer">
                            <h3 class="font-semibold text-sm">Filters</h3>
                            <Button variant="ghost" size="sm" class="w-9 p-0">
                                <ChevronDown
                                    :class="cn('h-4 w-4 transition-transform duration-200', isFiltersOpen ? 'rotate-180' : '')" />
                                <span class="sr-only">Toggle filters</span>
                            </Button>
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent
                        class="md:block md:h-auto md:overflow-visible data-[state=closed]:hidden md:data-[state=closed]:block">
                        <div class="flex flex-wrap items-center gap-4 w-full">
                            <TitleFilter v-model="filtersForm.search" @submit="submitFilters" />
                            <TagFilter v-model="filtersForm.tags" :tags="tags" />
                            <ClientFilter v-model="filtersForm.client_id" :clients="clients" />
                            <StatusFilter v-model="filtersForm.done" />
                            <OrderFilter v-model="filtersForm.order" />
                        </div>
                    </CollapsibleContent>
                </Collapsible>

            </div>

            <TaskDataTable :tasks="tasks" @toggle-done="(task) => updateTask(task, { done: !task.done })"
                @toggle-highlight="(task) => updateTask(task, { highlight: !task.highlight })" @edit="selectTask"
                @delete="startDelete" />

            <!-- Edit Sheet -->
            <EditTask v-model:open="isEditSheetOpen" :task="selectedTask" :clients="clients" :tags="tags" />

            <!-- Delete Confirmation Dialog -->
            <Dialog v-model:open="isDeleteDialogOpen">
                <DialogContent>
                    <form class="space-y-6" @submit.prevent="deleteTask">
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
                                <Button variant="secondary" type="button" class="cursor-pointer">
                                    Cancel
                                </Button>
                            </DialogClose>

                            <Button variant="destructive" type="submit" class="cursor-pointer" :disabled="isDeleting">
                                Delete task
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

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
