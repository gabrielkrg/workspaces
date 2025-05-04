<script setup lang="ts">
import PlaceholderPattern from '@/components/PlaceholderPattern.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2 } from 'lucide-vue-next';
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input';

interface Column {
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
}

const props = defineProps<{
    kanbans: Kanban[];
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
    // Update order of remaining columns
    columns.value.forEach((column, i) => {
        column.order = i + 1;
    });
    form.columns = columns.value.map(column => ({
        name: column.name,
        order: column.order,
    }));
};

const submit = () => {
    form.post('/kanban', {
        onSuccess: () => {
            form.reset();
            columns.value = [];
        },
    });
};

const editingKanban = ref<Kanban | null>(null);
const editKanbanName = ref('');

const startEditing = (kanban: Kanban) => {
    editingKanban.value = kanban;
    editKanbanName.value = kanban.name;
};

const updateKanban = (kanban: Kanban) => {
    if (!editKanbanName.value.trim()) return;

    router.put(`/kanban/${kanban.id}`, {
        name: editKanbanName.value,
    }, {
        preserveScroll: true,
        onSuccess: () => {
            editingKanban.value = null;
            editKanbanName.value = '';
        },
    });
};

const deleteKanban = (kanban: Kanban) => {
    router.delete(`/kanban/${kanban.id}`, {
        preserveScroll: true,
    });
};

const navigateToKanban = (kanban: Kanban) => {
    router.get(`/kanban/${kanban.id}`);
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
                                </div>

                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="columns" class="text-right">Columns</Label>
                                    <div class="col-span-4">
                                        <div class="flex flex-col gap-2">
                                            <div v-for="(column, index) in columns" :key="index"
                                                class="flex items-center gap-2">
                                                <span class="text-sm text-muted-foreground">#{{ column.order }}</span>
                                                <div class="flex-1 bg-gray-100 rounded px-3 py-1">
                                                    {{ column.name }}
                                                </div>
                                                <Button variant="ghost" size="icon" @click="removeColumn(index)">
                                                    <Trash2 class="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div class="mt-2 flex gap-2">
                                            <Input id="new-column" v-model="newColumnName"
                                                placeholder="Add new column..."
                                                @keyup.enter="addColumn(newColumnName)" />
                                            <Button type="button" @click="addColumn(newColumnName)">
                                                Add
                                            </Button>
                                        </div>
                                        <p class="text-xs text-muted-foreground mt-1">
                                            Press enter to add a new column
                                        </p>
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
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card v-for="kanban in kanbans" :key="kanban.id" class="cursor-pointer hover:bg-gray-50"
                    @click="navigateToKanban(kanban)">
                    <CardHeader>
                        <CardTitle class="flex justify-between items-center">
                            <div v-if="editingKanban?.id === kanban.id" class="flex gap-2 w-full">
                                <Input v-model="editKanbanName" type="text" class="flex-1"
                                    @keyup.enter="updateKanban(kanban)" />
                                <Button variant="outline" size="icon" @click.stop="updateKanban(kanban)">
                                    <Pencil class="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" @click.stop="editingKanban = null">
                                    <span class="sr-only">Cancelar</span>
                                    ×
                                </Button>
                            </div>
                            <div v-else class="flex justify-between items-center w-full">
                                <span>{{ kanban.name }}</span>
                                <div class="flex gap-2">
                                    <Button variant="ghost" size="icon" @click.stop="startEditing(kanban)">
                                        <Pencil class="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger as-child>
                                            <Button variant="ghost" size="icon" @click.stop>
                                                <Trash2 class="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Excluir Kanban</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Tem certeza que deseja excluir este Kanban? Esta ação não pode ser
                                                    desfeita.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction @click="deleteKanban(kanban)">
                                                    Excluir
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>
        </div>
    </AppLayout>
</template>
