<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, GripVertical, EllipsisVertical } from 'lucide-vue-next';
import draggable from 'vuedraggable';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
    cards_count: number;
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
            router.get(route('kanban.index'), {
                preserveState: true,
                replace: true,
            });
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
                                    <span class="text-sm text-red-500 col-span-full" v-if="form.errors.name">
                                        {{ form.errors.name }}
                                    </span>
                                </div>

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
                                                    <Button variant="destructive" type="button" size="icon"
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
                                    <span class="text-sm text-red-500 col-span-full" v-if="form.errors.columns">
                                        {{ form.errors.columns }}
                                    </span>
                                </div>
                            </div>
                            <SheetFooter>
                                <Button type="submit" class="cursor-pointer">Save</Button>
                            </SheetFooter>
                        </form>
                    </SheetContent>
                </Sheet>
            </div>

            <!-- Kanbans List -->
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4" v-if="kanbans.length > 0">
                <Card v-for="kanban in kanbans" :key="kanban.id" class="cursor-pointer gap-2"
                    @click="navigateToKanban(kanban)">
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">
                            Kanban
                        </CardTitle>
                        <div class="flex gap-2" @click.stop>
                            <Popover class="relative">
                                <PopoverTrigger as-child>
                                    <button type="button"
                                        class="cursor-pointer p-2 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-md">
                                        <EllipsisVertical class="text-gray-900 dark:text-white" />
                                    </button>
                                </PopoverTrigger>

                                <PopoverContent
                                    :class="cn('bg-sidebar absolute -top-10 right-5 z-50 w-40 rounded p-0 shadow')"
                                    :sideOffset="0" :align="'center'">
                                    <!-- Edit Button -->
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <div @click="startEditing(kanban)"
                                                class="dark:hover:bg-muted block w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100">
                                                Edit
                                            </div>
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
                                                        <span class="text-sm text-red-500 col-span-full"
                                                            v-if="formUpdateKanban.errors.name">
                                                            {{ formUpdateKanban.errors.name }}
                                                        </span>
                                                    </div>

                                                    <div class="grid grid-cols-4 items-center gap-4">
                                                        <Label for="edit-columns" class="text-right">Columns</Label>
                                                        <div class="col-span-4">
                                                            <draggable v-model="formUpdateKanban.columns"
                                                                :item-key="'id'" handle=".handle"
                                                                class="flex flex-col gap-2" @change="updateColumnOrder">
                                                                <template #item="{ element: column, index }">
                                                                    <div class="flex items-center gap-2">
                                                                        <div class="cursor-move px-2 handle">
                                                                            <GripVertical
                                                                                class="h-4 w-4 text-gray-400" />
                                                                        </div>
                                                                        <div class="flex-1">
                                                                            <Input v-model="column.name"
                                                                                class="bg-gray-100" />
                                                                        </div>
                                                                        <Button variant="destructive" type="button"
                                                                            size="icon"
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
                                                    <Button type="submit" class="cursor-pointer">Save changes</Button>
                                                </SheetFooter>
                                            </form>
                                        </SheetContent>
                                    </Sheet>

                                    <!-- Delete Button -->
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <div
                                                class="block w-full cursor-pointer px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900">
                                                Delete
                                            </div>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the
                                                    kanban
                                                    "{{ kanban.name }}" and all of its data.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel class="cursor-pointer">Cancel</AlertDialogCancel>
                                                <Button variant="destructive" type="button"
                                                    @click="deleteKanban(kanban)" :class="cn('cursor-pointer')">
                                                    Delete
                                                </Button>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </PopoverContent>
                            </Popover>

                        </div>
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold">
                            {{ kanban.name }}
                        </div>
                        <p class="text-xs text-muted-foreground">
                            {{ kanban.cards_count }} cards
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div v-else class="flex h-32 items-center justify-center rounded-lg border">
                <p class="text-gray-800 dark:text-gray-100">There are no kanbans yet</p>
            </div>
        </div>
    </AppLayout>
</template>
