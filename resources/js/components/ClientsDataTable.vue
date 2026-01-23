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
} from 'lucide-vue-next';

const props = defineProps<{
    clients: any[];
}>();

const emit = defineEmits<{
    'edit': [client: any];
    'delete': [id: number];
}>();

// Table Setup
const sorting = ref<SortingState>([]);

const columns: ColumnDef<any>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => ['Name', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
            );
        },
        cell: ({ row }) => {
            const client = row.original;
            return h('span', { class: 'font-medium' }, client.name);
        },
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => ['Email', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
            );
        },
        cell: ({ row }) => {
            const client = row.original;
            return client.email || '-';
        },
    },
    {
        accessorKey: 'phone',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => ['Phone', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
            );
        },
        cell: ({ row }) => {
            const client = row.original;
            return client.phone || '-';
        },
    },
    {
        accessorKey: 'address',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => ['Address', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
            );
        },
        cell: ({ row }) => {
            const client = row.original;
            return client.address || '-';
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const client = row.original;
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
                                    onClick: () => emit('edit', client),
                                    class: 'cursor-pointer',
                                },
                                () => [h(Pencil, { class: 'mr-2 h-4 w-4' }), 'Edit']
                            ),
                            h(DropdownMenuSeparator),
                            h(
                                DropdownMenuItem,
                                {
                                    onClick: () => emit('delete', client.id),
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
        return props.clients;
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
                            No clients found.
                        </TableCell>
                    </TableRow>
                </template>
            </TableBody>
        </Table>
    </div>
</template>
