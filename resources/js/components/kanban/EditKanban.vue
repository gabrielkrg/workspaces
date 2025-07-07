<script setup lang="ts">
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GripVertical, Pencil, Trash2 } from 'lucide-vue-next';
import { ref } from 'vue';
import { router, useForm } from '@inertiajs/vue3';
import draggable from 'vuedraggable';

interface Column {
    id?: number;
    name: string;
    order: number;
}

interface Kanban {
    id: number;
    name: string;
    columns: Column[];
}

const props = defineProps<{
    kanban: Kanban;
}>();

const isOpen = ref(false);
const newColumnName = ref('');

const formUpdateKanban = useForm({
    name: props.kanban.name,
    columns: [...props.kanban.columns].map(column => ({
        name: column.name,
        order: column.order,
        id: column.id,
    })),
});

// update kanban
const updateKanban = (kanban: Kanban) => {
    formUpdateKanban.put(route('kanban.update', kanban.id), {
        onSuccess: () => {
            isOpen.value = false;

            router.visit(route('kanban.show', kanban.id), {
                // preserveScroll: true,
                // preserveState: true,
            });
        },
        onError: () => {
            console.log('error');
        },
        preserveScroll: true,
        replace: true,
        // preserveState: true,
    });
};

// columns actions
const updateAddColumn = (columnName: string) => {
    if (!columnName.trim()) return;

    formUpdateKanban.columns.push({
        name: columnName,
        order: formUpdateKanban.columns.length + 1,
        id: undefined,
    });

    newColumnName.value = '';
};

const updateRemoveColumn = (index: number) => {
    formUpdateKanban.columns.splice(index, 1);
    formUpdateKanban.columns.forEach((column, i) => {
        column.order = i + 1;
        column.id = column.id;
        column.name = column.name;
    });
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
    <!-- Edit Button -->
    <Sheet v-model:open="isOpen">
        <SheetTrigger asChild>
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
                        <Input id="edit-name" v-model="formUpdateKanban.name" class="col-span-4" />
                        <span class="text-sm text-red-500 col-span-full" v-if="formUpdateKanban.errors.name">
                            {{ formUpdateKanban.errors.name }}
                        </span>
                    </div>

                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="edit-columns" class="text-right">Columns</Label>
                        <div class="col-span-4">
                            <draggable v-model="formUpdateKanban.columns" :item-key="'id'" handle=".handle"
                                class="flex flex-col gap-2" @change="updateColumnOrder">
                                <template #item="{ element: column, index }">
                                    <div class="flex items-center gap-2">
                                        <div class="cursor-move px-2 handle">
                                            <GripVertical class="h-4 w-4 text-gray-400" />
                                        </div>
                                        <div class="flex-1">
                                            <Input v-model="column.name" class="bg-gray-100" />
                                        </div>
                                        <Button variant="destructive" type="button" size="icon"
                                            @click="updateRemoveColumn(index)">
                                            <Trash2 class="h-4 w-4" />
                                        </Button>
                                    </div>
                                </template>
                            </draggable>
                            <div class="mt-2 flex gap-2">
                                <Input id="edit-new-column" v-model="newColumnName" placeholder="Add new column..."
                                    @keyup.enter="updateAddColumn(newColumnName)" />
                                <Button type="button" @click="updateAddColumn(newColumnName)">
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
</template>