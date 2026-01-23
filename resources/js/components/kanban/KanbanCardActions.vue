<script setup lang="ts">
import { ref } from 'vue';
import { useForm, router } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { EllipsisVertical, GripVertical, Trash2 } from 'lucide-vue-next';
import draggable from 'vuedraggable';
import { cn } from '@/lib/utils';
import type { Kanban } from '@/types';
import CloneKanban from '@/components/kanban/CloneKanban.vue';

const props = defineProps<{
    kanban: Kanban;
}>();

const newColumnName = ref('');
const isEditSheetOpen = ref(false);

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

const startEditing = () => {
    formUpdateKanban.name = props.kanban.name;

    formUpdateKanban.columns = [...props.kanban.columns].map(column => ({
        name: column.name,
        order: column.order,
        id: column.id,
    }));

    isEditSheetOpen.value = true;
};

const updateKanban = () => {
    formUpdateKanban.put(route('kanban.update', props.kanban.id), {
        onSuccess: () => {
            formUpdateKanban.reset();
            isEditSheetOpen.value = false;
            router.get(route('kanban.index'), {
                preserveState: true,
                replace: true,
            });
        },
    });
};

const deleteKanban = () => {
    router.delete(route('kanban.delete', props.kanban.id), {
        preserveScroll: true,
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
    <Popover class="relative">
        <PopoverTrigger as-child>
            <button type="button"
                class="cursor-pointer p-2 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-md">
                <EllipsisVertical class="text-gray-900 dark:text-white" />
            </button>
        </PopoverTrigger>

        <PopoverContent :class="cn('bg-sidebar absolute -top-10 right-5 z-50 w-40 rounded p-0 shadow')" :sideOffset="0"
            :align="'center'">
            <!-- Edit Button -->
            <Sheet v-model:open="isEditSheetOpen">
                <SheetTrigger asChild>
                    <div @click="startEditing"
                        class="dark:hover:bg-muted block w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100">
                        Edit
                    </div>
                </SheetTrigger>
                <SheetContent>
                    <form @submit.prevent="updateKanban">
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
                                        <Input id="edit-new-column" v-model="newColumnName"
                                            placeholder="Add new column..."
                                            @keyup.enter="updateAddColumn(newColumnName)" />
                                        <Button type="button" @click="updateAddColumn(newColumnName)">
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <SheetFooter>
                            <CloneKanban :kanban="kanban" />
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
                        <Button variant="destructive" type="button" @click="deleteKanban" :class="cn('cursor-pointer')">
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </PopoverContent>
    </Popover>
</template>
