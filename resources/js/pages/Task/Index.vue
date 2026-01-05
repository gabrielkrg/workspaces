<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/vue3';
import { Check, ChevronDown, EllipsisVertical, Highlighter, Kanban } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';
import { useFilter } from 'reka-ui'
import {
    Combobox,
    ComboboxAnchor,
    ComboboxInput,
    ComboboxList,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxItem,
} from '@/components/ui/combobox';
import { cn } from '@/lib/utils';
import DialogClose from '@/components/ui/dialog/DialogClose.vue';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];

const props = defineProps<{
    tasks: any[],
    tags: { name: string, color: string }[],
    filters: object,
    clients: any[],
}>();

const form = useForm({
    title: '',
    description: '',
    client_id: null,
    repeat: 'none',
    tags: [] as string[],
    delete_after: false,
});

const submit = () => {
    form.post(route('tasks.store'), {
        onSuccess: () => {
            form.reset();

            router.get(route('tasks.index'), {
                preserveState: true,
                replace: true,
            });
        },
    });
};

const selectedTask = ref(null);

const updateForm = useForm({
    title: '',
    repeat: '',
    tags: [] as string[],
    client_id: null,
    description: '',
    delete_after: false,
});

const selectTask = (task) => {
    selectedTask.value = task;

    updateForm.title = task.title;
    updateForm.repeat = task.repeat;
    updateForm.tags = task.tags?.map((tag) => tag.name) || [];
    updateForm.description = task.description;
    updateForm.delete_after = task.delete_after;
    updateForm.client_id = task.client_id;
};

const update = (taskId) => {
    if (selectedTask.value == null) return;

    updateForm.put(route('tasks.update', taskId), {
        onSuccess: () => {
            updateForm.reset();

            router.get(route('tasks.index'), {
                preserveState: true,
                replace: true,
            });
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
                task.repeat = updatedTask.repeat;
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
        onSuccess: () => {
            router.get(route('tasks.index'), {
                preserveState: true,
                replace: true,
            });
        },
        onError: (errors) => {
            console.log('Erro ao atualizar tarefa:', errors);
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

const openSearchTerm = ref(false)
const searchTerm = ref('')

const { contains } = useFilter({ sensitivity: 'base' })

const filteredTags = computed(() => {
    const options = props.tags.filter(i => !form.tags.includes(i.name))
    return searchTerm.value ? options.filter(option => contains(option.name, searchTerm.value)) : options
})

const openSearchTermFilter = ref(false)
const searchTermFilter = ref('')

const filteredTagsFilter = computed(() => {
    const options = props.tags.filter(i => !filtersForm.tags.includes(i.name))
    return searchTermFilter.value ? options.filter(option => contains(option.name, searchTermFilter.value)) : options
})

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
        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div class="flex flex-wrap items-end justify-between gap-4">
                <div class="grid grid-cols-1 gap-4">
                    <Popover>
                        <PopoverTrigger as-child>
                            <Button variant="outline"> Filters
                                <ChevronDown class="h-5 w-5 text-gray-900 dark:text-white" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent class="flex w-80 flex-col gap-3" :side="'bottom'" align="start"
                            :side-offset="4">
                            <div class="flex w-full max-w-sm flex-col gap-1.5">
                                <Label for="search">Title</Label>
                                <Input @input="submitFilters" id="search" type="search" placeholder="Title"
                                    v-model="filtersForm.search" />
                            </div>

                            <div class="flex w-full max-w-sm flex-col gap-1.5">
                                <Label for="tag">Tag</Label>
                                <Combobox v-model="filtersForm.tags" v-model:open="openSearchTermFilter"
                                    :ignore-filter="true">
                                    <ComboboxAnchor as-child>
                                        <TagsInput :model-value="filtersForm.tags" @update:model-value="(val) => {
                                            filtersForm.tags = [...val]
                                            submitFilters()
                                        }" :class="cn('p-0 gap-0 w-full bg-input/30')">

                                            <div
                                                :class="['flex gap-2 flex-wrap items-center', filtersForm.tags.length > 0 ? 'p-2' : '']">
                                                <TagsInputItem v-for="tag in filtersForm.tags" :key="tag" :value="tag">
                                                    <TagsInputItemText />
                                                    <TagsInputItemDelete />
                                                </TagsInputItem>
                                            </div>

                                            <ComboboxInput v-model="searchTermFilter" as-child>
                                                <TagsInputInput placeholder="Select tags..."
                                                    :class="cn('min-w-[200px] w-full p-0 focus-visible:ring-0 h-auto')"
                                                    @keydown.enter.prevent />
                                            </ComboboxInput>
                                        </TagsInput>

                                        <ComboboxList class="w-[--reka-popper-anchor-width]">
                                            <ComboboxEmpty />
                                            <ComboboxGroup>
                                                <ComboboxItem v-for="tag in filteredTagsFilter" :key="tag.name"
                                                    :value="tag.name" @select.prevent="(ev) => {
                                                        if (typeof ev.detail.value === 'string') {
                                                            searchTermFilter = ''
                                                            filtersForm.tags.push(ev.detail.value)
                                                        }

                                                        if (filteredTagsFilter.length === 0) {
                                                            openSearchTermFilterMobile = false
                                                        }
                                                    }">
                                                    {{ tag.name }}
                                                </ComboboxItem>
                                            </ComboboxGroup>
                                        </ComboboxList>
                                    </ComboboxAnchor>
                                </Combobox>
                            </div>

                            <div class="flex w-full max-w-sm flex-col gap-1.5">
                                <Label for="status">Status</Label>
                                <Select v-model="filtersForm.done">
                                    <SelectTrigger id="status" class="w-full">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem :value="null"> All </SelectItem>
                                        <SelectItem value="false"> To do </SelectItem>
                                        <SelectItem value="true"> Done </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div class="flex w-full max-w-sm flex-col gap-1.5">
                                <Label for="order">Order by</Label>
                                <Select v-model="filtersForm.order">
                                    <SelectTrigger id="order" class="w-full">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="recent"> Recent </SelectItem>
                                        <SelectItem value="oldest"> Oldest </SelectItem>
                                        <SelectItem value="title"> Title </SelectItem>
                                        <SelectItem value="highlight"> Highlight </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div class="flex w-full max-w-sm flex-col gap-1.5">
                                <Label for="client">Client</Label>
                                <Select v-model="filtersForm.client_id">
                                    <SelectTrigger id="client" class="w-full">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem :value="null"> All </SelectItem>
                                        <SelectItem v-for="client in clients" :key="client.id" :value="client.id">
                                            {{ client.name }}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>


                <Sheet>
                    <SheetTrigger as-child>
                        <Button variant="default" class="cursor-pointer"> Create </Button>
                    </SheetTrigger>
                    <SheetContent :class="cn('overflow-y-auto')">
                        <form @submit.prevent="submit">
                            <SheetHeader>
                                <SheetTitle>Create task</SheetTitle>
                                <SheetDescription> Fill the fields to create a new task. Click save when you're done.
                                </SheetDescription>
                            </SheetHeader>
                            <div class="grid gap-4 p-4">
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="title" class="text-right"> Title </Label>
                                    <Input id="title" v-model="form.title" class="col-span-4" />
                                    <div v-if="form.errors.title" class="text-sm text-red-500 col-span-full">
                                        {{ form.errors.title }}
                                    </div>
                                </div>

                                <div class="flex flex-col gap-4">
                                    <Label for="title" class="text-right"> Client </Label>
                                    <Select v-model="form.client_id">
                                        <SelectTrigger id="role" class="w-full">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectItem v-for="client in clients" :key="client.id" :value="client.id">
                                                {{ client.name }}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div class="flex flex-col gap-4">
                                    <Label for="title" class="text-right"> Repeat </Label>
                                    <Select v-model="form.repeat" class="">
                                        <SelectTrigger id="role" class="w-full">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectItem value="none"> Never </SelectItem>
                                            <SelectItem value="daily"> Daily </SelectItem>
                                            <SelectItem value="weekly"> Weekly </SelectItem>
                                            <SelectItem value="monthly"> Monthly </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div class="flex flex-col gap-4">
                                    <Label for="title" class="text-right"> Tags </Label>
                                    <div>
                                        <Combobox v-model="form.tags" v-model:open="openSearchTerm"
                                            :ignore-filter="true">
                                            <ComboboxAnchor as-child :class="cn('dark:bg-input/30')">
                                                <TagsInput :model-value="form.tags"
                                                    @update:model-value="(val) => (form.tags = val)"
                                                    :class="cn('p-0 gap-0 w-full bg-input/30')">

                                                    <div
                                                        :class="['flex gap-2 flex-wrap items-center', form.tags.length > 0 ? 'p-2' : '']">
                                                        <TagsInputItem v-for="tag in form.tags" :key="tag" :value="tag">
                                                            <TagsInputItemText />
                                                            <TagsInputItemDelete />
                                                        </TagsInputItem>
                                                    </div>

                                                    <ComboboxInput v-model="searchTerm" as-child>
                                                        <TagsInputInput placeholder="Tags..."
                                                            :class="cn('min-w-[200px] w-full p-0 focus-visible:ring-0 h-auto')"
                                                            @keydown.enter.prevent />
                                                    </ComboboxInput>
                                                </TagsInput>

                                                <ComboboxList class="w-[--reka-popper-anchor-width]">
                                                    <ComboboxEmpty />
                                                    <ComboboxGroup>
                                                        <ComboboxItem v-for="tag in filteredTags" :key="tag.name"
                                                            :value="tag.name" @select.prevent="(ev) => {
                                                                if (typeof ev.detail.value === 'string') {
                                                                    searchTerm = ''
                                                                    form.tags.push(ev.detail.value)
                                                                }

                                                                if (filteredTags.length === 0) {
                                                                    openSearchTerm = false
                                                                }
                                                            }">
                                                            {{ tag.name }}
                                                        </ComboboxItem>
                                                    </ComboboxGroup>
                                                </ComboboxList>
                                            </ComboboxAnchor>
                                        </Combobox>

                                        <span class="text-xs text-gray-500"> Use comma <span class="font-bold">( ,
                                                )</span> to add </span>
                                    </div>

                                    <div v-if="form.errors.tags" class="text-sm text-red-500">
                                        {{ form.errors.tags }}
                                    </div>
                                </div>


                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="description" class="text-right"> Description </Label>
                                    <Textarea id="description" v-model="form.description"
                                        placeholder="Type your description here." class="col-span-4" />
                                </div>

                                <div class="items-top flex gap-x-2">
                                    <Checkbox id="delete" v-model="form.delete_after" />
                                    <div class="grid gap-1.5 leading-none">
                                        <label for="delete"
                                            class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Delete after conclusion
                                        </label>
                                        <p class="text-muted-foreground text-sm">
                                            Be careful, if checked this tasks will be automatically deleted after
                                            conclusion.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <SheetFooter>
                                <div class="flex justify-end gap-2">
                                    <SheetClose asChild>
                                        <Button variant="outline" type="button" class="cursor-pointer">Cancel</Button>
                                    </SheetClose>

                                    <Button type="submit" :disabled="form.processing"
                                        class="cursor-pointer">Save</Button>
                                </div>
                            </SheetFooter>
                        </form>
                    </SheetContent>
                </Sheet>
            </div>

            <!-- progress -->
            <div class="w-full max-w-md">
                <div class="w-full max-w-md" v-if="tasks.length > 0">
                    <p class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Progress: {{ percent }}%</p>

                    <div class="bg-sidebar-accent h-4 w-full overflow-hidden rounded-full shadow-md">
                        <div class="h-full bg-green-500 transition-all duration-300 ease-in-out"
                            :style="{ width: `${percent}%` }" />
                    </div>
                </div>
            </div>


            <div class="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min p-4"
                v-if="tasks.length > 0">
                <!-- tasks list -->
                <div v-for="task in tasks" :key="task.id" class="group flex items-start gap-4 border-b p-4"
                    :class="{ 'line-through': task.done }">
                    <!-- Checkbox -->
                    <div class="flex items-start pt-1">
                        <label class="inline-flex cursor-pointer items-center">
                            <input type="checkbox" :checked="task.done" @change="updateTask(task, { done: !task.done })"
                                class="peer sr-only" />
                            <div
                                class="flex h-5 w-5 items-center justify-center rounded border-2 border-gray-300 transition-colors duration-300 peer-checked:border-green-600 peer-checked:bg-green-600">
                                <Check v-if="task.done" class="h-4 w-4 text-white" />
                            </div>
                        </label>
                    </div>

                    <!-- Title, Tags, Description -->
                    <div class="flex-1 min-w-0">
                        <div class="flex flex-col md:flex-row gap-2 flex-wrap">
                            <h2 class="text-lg font-semibold text-gray-900 dark:text-white order-2 md:order-1"
                                :class="{ 'highlighter highlight': task.highlight }">
                                {{ task.title }}
                            </h2>
                            <div class="flex items-center gap-1 flex-wrap order-1 md:order-2">
                                <div class="flex rounded bg-green-700 px-1 text-xs font-normal text-white capitalize"
                                    v-if="task.repeat != 'none'">
                                    {{ task.repeat }}
                                </div>
                                <div v-for="tag in task.tags" :key="tag.index">
                                    <div class="flex rounded bg-gray-400 px-1 text-xs font-normal text-white capitalize"
                                        :style="tag.color ? { backgroundColor: tag.color } : { backgroundColor: '#9ca3af' }">
                                        {{ tag.name }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p class="mt-1 text-gray-700 dark:text-gray-300 break-words inline-block ellipsis"
                            :class="{ 'highlighter highlight': task.highlight }">
                            {{ task.description }}
                        </p>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-start justify-end gap-1">
                        <!-- <button type="button"
                            class="cursor-pointer p-2 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-md"
                            @click="startTimer(task.id)">
                            <Timer class="text-gray-900 dark:text-white" />
                        </button> -->
                        <Link :href="route('kanban.show', { kanban: task.kanban_id })" v-if="task.kanban_id"
                            class="cursor-pointer p-2 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-md">
                        <Kanban class="text-gray-900 dark:text-white" />
                        </Link>
                        <button type="button"
                            :class="{ 'bg-accent hover:bg-accent/90 hover:text-accent-foreground dark:hover:bg-accent/50': task.highlight }"
                            class="cursor-pointer p-2 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-md"
                            @click="updateTask(task, { highlight: !task.highlight })">
                            <Highlighter class="text-gray-900 dark:text-white" />
                        </button>
                        <Popover class=" relative">
                            <PopoverTrigger as-child>
                                <button type="button"
                                    class="cursor-pointer p-2 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-md">
                                    <EllipsisVertical class="text-gray-900 dark:text-white" />
                                </button>
                            </PopoverTrigger>

                            <PopoverContent
                                :class="cn('bg-sidebar absolute -top-10 right-5 z-50 w-40 rounded p-0 shadow')"
                                :sideOffset="0" :align="'center'">
                                <Sheet>
                                    <SheetTrigger as-child>
                                        <SheetClose as-child>
                                            <div @click="selectTask(task)"
                                                class="dark:hover:bg-muted block w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100">
                                                Edit
                                            </div>
                                        </SheetClose>
                                    </SheetTrigger>
                                    <SheetContent :class="cn('overflow-y-auto')">
                                        <form @submit.prevent="update(task)">
                                            <SheetHeader>
                                                <SheetTitle> Edit task </SheetTitle>
                                                <SheetDescription> Click save when you're done.
                                                </SheetDescription>
                                            </SheetHeader>
                                            <div class="grid gap-4 p-4">
                                                <div class="grid grid-cols-4 items-center gap-4">
                                                    <Label for="title" class="text-right"> Title
                                                    </Label>
                                                    <Input id="title" v-model="updateForm.title" class="col-span-4" />
                                                    <div v-if="updateForm.errors.title"
                                                        class="text-sm text-red-500 col-span-full">
                                                        {{ updateForm.errors.title }}
                                                    </div>
                                                </div>

                                                <div class="flex flex-col gap-4">
                                                    <Label for="title" class="text-right"> Client
                                                    </Label>
                                                    <Select v-model="updateForm.client_id" class="">
                                                        <SelectTrigger id="role" class="w-full">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent position="popper">
                                                            <SelectItem v-for="client in clients" :key="client.id"
                                                                :value="client.id">
                                                                {{ client.name }}
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div class="flex flex-col gap-4">
                                                    <Label for="title" class="text-right"> Repeat
                                                    </Label>
                                                    <Select v-model="updateForm.repeat" class="">
                                                        <SelectTrigger id="role" class="w-full">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent position="popper">
                                                            <SelectItem value="none"> Never
                                                            </SelectItem>
                                                            <SelectItem value="daily"> Daily
                                                            </SelectItem>
                                                            <SelectItem value="weekly"> Weekly
                                                            </SelectItem>
                                                            <SelectItem value="monthly"> Monthly
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div class="flex flex-col gap-4">
                                                    <Label for="title" class="text-right"> Tags </Label>
                                                    <div>
                                                        <Combobox v-model="updateForm.tags"
                                                            v-model:open="openSearchTerm" :ignore-filter="true">
                                                            <ComboboxAnchor as-child>
                                                                <TagsInput :model-value="updateForm.tags"
                                                                    @update:model-value="(val) => (updateForm.tags = val)"
                                                                    :class="cn('p-0 gap-0 w-full bg-input/30')">

                                                                    <div
                                                                        :class="['flex gap-2 flex-wrap items-center', updateForm.tags.length > 0 ? 'p-2' : '']">
                                                                        <TagsInputItem v-for="tag in updateForm.tags"
                                                                            :key="tag" :value="tag">
                                                                            <TagsInputItemText />
                                                                            <TagsInputItemDelete />
                                                                        </TagsInputItem>
                                                                    </div>

                                                                    <ComboboxInput v-model="searchTerm" as-child>
                                                                        <TagsInputInput placeholder="Tags..."
                                                                            :class="cn('min-w-[200px] w-full p-0 focus-visible:ring-0 h-auto')"
                                                                            @keydown.enter.prevent />
                                                                    </ComboboxInput>
                                                                </TagsInput>

                                                                <ComboboxList class="w-[--reka-popper-anchor-width]">
                                                                    <ComboboxEmpty />
                                                                    <ComboboxGroup>
                                                                        <ComboboxItem v-for="tag in filteredTags"
                                                                            :key="tag.name" :value="tag.name"
                                                                            @select.prevent="(ev) => {
                                                                                if (typeof ev.detail.value === 'string') {
                                                                                    searchTerm = ''
                                                                                    updateForm.tags.push(ev.detail.value)
                                                                                }

                                                                                if (filteredTags.length === 0) {
                                                                                    openSearchTerm = false
                                                                                }
                                                                            }">
                                                                            {{ tag.name }}
                                                                        </ComboboxItem>
                                                                    </ComboboxGroup>
                                                                </ComboboxList>
                                                            </ComboboxAnchor>
                                                        </Combobox>

                                                        <span class="text-xs text-gray-500">
                                                            Use comma <span class="font-bold">( ,
                                                                )</span> to
                                                            add
                                                        </span>
                                                    </div>

                                                    <div v-if="updateForm.errors.tags" class="text-sm text-red-500">
                                                        {{ updateForm.errors.tags }}
                                                    </div>
                                                </div>

                                                <div class="grid grid-cols-4 items-center gap-4">
                                                    <Label for="description" class="text-right">
                                                        Description
                                                    </Label>
                                                    <Textarea id="description" v-model="updateForm.description"
                                                        class="col-span-4" />
                                                </div>

                                                <div class="items-top flex gap-x-2">
                                                    <Checkbox id="delete2" v-model="updateForm.delete_after" />
                                                    <div class="grid gap-1.5 leading-none">
                                                        <label for="delete2"
                                                            class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                            Delete after conclusion
                                                        </label>
                                                        <p class="text-muted-foreground text-sm">
                                                            Be careful, if checked this tasks will be
                                                            automatically deleted after conclusion.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <SheetFooter>
                                                <div class="flex justify-end gap-2">
                                                    <SheetClose asChild>
                                                        <Button variant="outline" type="button"
                                                            class="cursor-pointer">Cancel</Button>
                                                    </SheetClose>

                                                    <Button type="submit" :disabled="updateForm.processing"
                                                        class="cursor-pointer">Save</Button>
                                                </div>
                                            </SheetFooter>
                                        </form>
                                    </SheetContent>
                                </Sheet>
                                <Dialog>
                                    <DialogTrigger as-child>
                                        <div class="block w-full cursor-pointer px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                                            variant="destructive">
                                            Delete
                                        </div>
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
                                                    <Button variant="secondary" type="button" class="cursor-pointer">
                                                        Cancel
                                                    </Button>
                                                </DialogClose>

                                                <Button variant="destructive" type="submit" class="cursor-pointer"
                                                    :disabled="form.processing">
                                                    Delete task
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>
            <div v-else class="flex h-32 items-center justify-center rounded-lg border">
                <p class="text-gray-800 dark:text-gray-100">There are no tasks yet</p>
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
