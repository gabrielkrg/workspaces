<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Trash2, GripVertical } from 'lucide-vue-next';
import draggable from 'vuedraggable';
import { cn } from '@/lib/utils';

interface Column {
    name: string;
    order: number;
}

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
            newColumnName.value = '';
        },
    });
};
</script>

<template>
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
</template>
