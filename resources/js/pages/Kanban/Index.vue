<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, GripVertical } from 'lucide-vue-next';
import draggable from 'vuedraggable';
import { useFilter } from 'reka-ui';
import { cn } from '@/lib/utils';
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input';

import {
    Combobox,
    ComboboxAnchor,
    ComboboxInput,
    ComboboxList,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxItem,
} from '@/components/ui/combobox';


interface Column {
    id?: number;
    name: string;
    order: number;
}

interface Kanban {
    id: number;
    name: string;
    workspace_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    columns: Column[];
}

interface Tag {
    id: number;
    name: string;
}

const props = defineProps<{
    kanbans: Kanban[];
    tags: Tag[];
}>();

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kanban',
        href: '/kanban',
    },
];

const newColumnName = ref('');
const columns = ref<Column[]>([]);

const form = useForm({
    name: '',
    tags: [] as string[],
    columns: [] as unknown as Record<string, any>[],
});

const addColumn = (columnName: string) => {
    if (!columnName.trim()) return;

    const newColumn: Column = {
        name: columnName,
        order: columns.value.length + 1,
    };

    columns.value.push(newColumn);

    form.columns = columns.value.map(column => ({
        name: column.name,
        order: column.order,
    }));

    newColumnName.value = '';
};

const removeColumn = (index: number) => {
    columns.value.splice(index, 1);
    columns.value.forEach((column, i) => {
        column.order = i + 1;
    });

    form.columns = columns.value.map(column => ({
        name: column.name,
        order: column.order,
    }));
};

const columnOrder = () => {
    form.columns.forEach((column, index) => {
        column.order = index + 1;
        column.id = column.id;
        column.name = column.name;
    });
};

const submit = () => {
    form.post(route('kanban.store'), {
        onSuccess: () => {
            form.reset();
            columns.value = [];
        },
    });
};

const formUpdateKanban = useForm({
    name: '',
    columns: [] as unknown as Record<string, any>[],
});

const updateRemoveColumn = (index: number) => {
    formUpdateKanban.columns.splice(index, 1);
    formUpdateKanban.columns.forEach((column, i) => {
        column.order = i + 1;
        column.id = column.id;
        column.name = column.name;
    });
};

const updateAddColumn = (columnName: string) => {
    if (!columnName.trim()) return;

    formUpdateKanban.columns.push({
        name: columnName,
        order: formUpdateKanban.columns.length + 1,
    });

    newColumnName.value = '';
};

const startEditing = (kanban: Kanban) => {
    formUpdateKanban.name = kanban.name;

    formUpdateKanban.columns = [...kanban.columns].map(column => ({
        name: column.name,
        order: column.order,
        id: column.id,
    }));
};

const updateKanban = (kanban: Kanban) => {
    formUpdateKanban.put(route('kanban.update', kanban.id), {
        onSuccess: () => {
            formUpdateKanban.reset();
        },
    });
};

const deleteKanban = (kanban: Kanban) => {
    router.delete(route('kanban.delete', kanban.id), {
        preserveScroll: true,
    });
};

const navigateToKanban = (kanban: Kanban) => {
    router.get(route('kanban.show', kanban.id));
};

const updateColumnOrder = () => {
    formUpdateKanban.columns.forEach((column, index) => {
        column.order = index + 1;
        column.id = column.id;
        column.name = column.name;
    });
};

const openSearchTerm = ref(false)
const searchTerm = ref('')

const { contains } = useFilter({ sensitivity: 'base' })

const filteredTags = computed(() => {
    const options = props.tags.filter(i => !form.tags.includes(i.name))
    return searchTerm.value ? options.filter(option => contains(option.name, searchTerm.value)) : options
})
</script>

<template>

    <Head title="Kanbans" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div class="flex flex-wrap items-end justify-between gap-4">
                <Sheet>
                    <SheetTrigger as-child>
                        <Button variant="default" class="cursor-pointer"> Create </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <form @submit.prevent="submit">
                            <SheetHeader>
                                <SheetTitle>Create Kanban</SheetTitle>
                                <SheetDescription>Fill the fields to create a new Kanban. Click save when you're done.
                                </SheetDescription>
                            </SheetHeader>
                            <div class="grid gap-4 p-4">
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="name" class="text-right">Name</Label>
                                    <Input id="name" v-model="form.name" class="col-span-4" />
                                </div>

                                <!-- <div class="flex flex-col gap-4">
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
                                </div> -->

                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="edit-columns" class="text-right">Columns</Label>
                                    <div class="col-span-4">
                                        <draggable v-model="form.columns" :item-key="'id'" handle=".handle"
                                            class="flex flex-col gap-2" @change="columnOrder">
                                            <template #item="{ element: column, index }">
                                                <div class="flex items-center gap-2">
                                                    <div class="cursor-move px-2 handle">
                                                        <GripVertical class="h-4 w-4 text-gray-400" />
                                                    </div>
                                                    <div class="flex-1">
                                                        <Input v-model="column.name" class="bg-gray-100" />
                                                    </div>
                                                    <Button variant="ghost" type="button" size="icon"
                                                        :class="cn('cursor-pointer')" @click="removeColumn(index)">
                                                        <Trash2 class="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </template>
                                        </draggable>
                                        <div class="mt-2 flex gap-2">
                                            <Input id="edit-new-column" v-model="newColumnName"
                                                placeholder="Add new column..."
                                                @keyup.enter="addColumn(newColumnName)" />
                                            <Button type="button" @click="addColumn(newColumnName)">
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <SheetFooter>
                                <SheetClose as-child>
                                    <Button type="submit" class="cursor-pointer">Save</Button>
                                </SheetClose>
                            </SheetFooter>
                        </form>
                    </SheetContent>
                </Sheet>
            </div>

            <!-- Kanbans List -->
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3" v-if="kanbans.length > 0">
                <Card v-for="kanban in kanbans" :key="kanban.id" class="cursor-pointer"
                    @click="navigateToKanban(kanban)">
                    <CardHeader>
                        <CardTitle class="flex items-center justify-between">
                            <span>{{ kanban.name }}</span>
                            <div class="flex gap-2" @click.stop>
                                <!-- Edit Button -->
                                <Sheet>
                                    <SheetTrigger asChild @click="startEditing(kanban)">
                                        <Button class="cursor-pointer" size="icon" title="Edit">
                                            <Pencil class="text-white dark:text-black" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent>
                                        <form @submit.prevent="updateKanban(kanban)">
                                            <SheetHeader>
                                                <SheetTitle>Edit Kanban</SheetTitle>
                                                <SheetDescription>
                                                    Update the kanban details. Click save when you're done.
                                                </SheetDescription>
                                            </SheetHeader>
                                            <div class="grid gap-4 p-4">
                                                <div class="grid grid-cols-4 items-center gap-4">
                                                    <Label for="edit-name" class="text-right">Name</Label>
                                                    <Input id="edit-name" v-model="formUpdateKanban.name"
                                                        class="col-span-4" />
                                                </div>

                                                <div class="grid grid-cols-4 items-center gap-4">
                                                    <Label for="edit-columns" class="text-right">Columns</Label>
                                                    <div class="col-span-4">
                                                        <draggable v-model="formUpdateKanban.columns" :item-key="'id'"
                                                            handle=".handle" class="flex flex-col gap-2"
                                                            @change="updateColumnOrder">
                                                            <template #item="{ element: column, index }">
                                                                <div class="flex items-center gap-2">
                                                                    <div class="cursor-move px-2 handle">
                                                                        <GripVertical class="h-4 w-4 text-gray-400" />
                                                                    </div>
                                                                    <div class="flex-1">
                                                                        <Input v-model="column.name"
                                                                            class="bg-gray-100" />
                                                                    </div>
                                                                    <Button variant="ghost" type="button" size="icon"
                                                                        @click="updateRemoveColumn(index)">
                                                                        <Trash2 class="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </template>
                                                        </draggable>
                                                        <div class="mt-2 flex gap-2">
                                                            <Input id="edit-new-column" v-model="newColumnName"
                                                                placeholder="Add new column..."
                                                                @keyup.enter="updateAddColumn(newColumnName)" />
                                                            <Button type="button"
                                                                @click="updateAddColumn(newColumnName)">
                                                                Add
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <SheetFooter>
                                                <SheetClose asChild>
                                                    <Button type="submit" class="cursor-pointer">Save changes</Button>
                                                </SheetClose>
                                            </SheetFooter>
                                        </form>
                                    </SheetContent>
                                </Sheet>

                                <!-- Delete Button -->
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="icon" title="Delete"
                                            :class="cn('cursor-pointer')">
                                            <Trash2 class="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the kanban
                                                "{{ kanban.name }}" and all of its data.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel class="cursor-pointer">Cancel</AlertDialogCancel>
                                            <Button variant="destructive" type="button" @click="deleteKanban(kanban)"
                                                :class="cn('cursor-pointer')">
                                                Delete
                                            </Button>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>
            <div v-else>
                <div class="flex h-full items-center justify-center">
                    <p class="text-sm text-gray-500">No kanbans found. Create one to get started.</p>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
