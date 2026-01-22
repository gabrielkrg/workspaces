<script setup lang="ts">
import { ref, h } from 'vue';
import {
    useVueTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    FlexRender,
    type ColumnDef,
    type SortingState,
    type ColumnFiltersState,
} from '@tanstack/vue-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
    ArrowUpDown,
    MoreHorizontal,
    Pencil,
    Trash2,
    Eye,
} from 'lucide-vue-next';
import { router } from '@inertiajs/vue3';

const props = defineProps<{
    notes: any[];
}>();

const emit = defineEmits<{
    'edit': [note: any];
    'delete': [id: number];
}>();

// Table Setup
const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);

const columns: ColumnDef<any>[] = [
    {
        accessorKey: 'title',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => ['Title', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
            );
        },
        cell: ({ row }) => {
            const note = row.original;
            return h(
                'span',
                {
                    class: 'font-medium cursor-pointer hover:underline',
                    onClick: () => router.visit(route('notes.show', { note: note.id }))
                },
                note.title
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const note = row.original;
            return h(
                DropdownMenu,
                {},
                {
                    default: () => [
                        h(DropdownMenuTrigger, { asChild: true }, () =>
                            h(Button, { variant: 'ghost', class: 'h-8 w-8 p-0' }, () =>
                                h(MoreHorizontal, { class: 'h-4 w-4' })
                            )
                        ),
                        h(DropdownMenuContent, { align: 'end' }, () => [
                            h(
                                DropdownMenuItem,
                                {
                                    onClick: () => router.visit(route('notes.show', { note: note.id })),
                                    class: 'cursor-pointer',
                                },
                                () => [h(Eye, { class: 'mr-2 h-4 w-4' }), 'View']
                            ),
                            h(
                                DropdownMenuItem,
                                {
                                    onClick: () => emit('edit', note),
                                    class: 'cursor-pointer',
                                },
                                () => [h(Pencil, { class: 'mr-2 h-4 w-4' }), 'Edit']
                            ),
                            h(DropdownMenuSeparator),
                            h(
                                DropdownMenuItem,
                                {
                                    onClick: () => emit('delete', note.id),
                                    class: 'cursor-pointer text-red-600 focus:text-red-600',
                                },
                                () => [h(Trash2, { class: 'mr-2 h-4 w-4' }), 'Delete']
                            ),
                        ]),
                    ],
                }
            );
        },
    },
];

const table = useVueTable({
    get data() {
        return props.notes;
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: (updaterOrValue) => {
        sorting.value =
            typeof updaterOrValue === 'function' ? updaterOrValue(sorting.value) : updaterOrValue;
    },
    state: {
        get sorting() {
            return sorting.value;
        },
    },
});
</script>

<template>
    <div class="rounded-md border">
        <Table>
            <TableHeader>
                <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                    <TableHead v-for="header in headerGroup.headers" :key="header.id">
                        <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                            :props="header.getContext()" />
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <template v-if="table.getRowModel().rows?.length">
                    <TableRow v-for="row in table.getRowModel().rows" :key="row.id"
                        :data-state="row.getIsSelected() && 'selected'">
                        <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                        </TableCell>
                    </TableRow>
                </template>
                <template v-else>
                    <TableRow>
                        <TableCell :colspan="columns.length" class="h-24 text-center">
                            No notes found.
                        </TableCell>
                    </TableRow>
                </template>
            </TableBody>
        </Table>
    </div>
</template>
