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
import { Badge } from '@/components/ui/badge';
import {
    ArrowUpDown,
    MoreHorizontal,
    Pencil,
    Trash2,
} from 'lucide-vue-next';

const props = defineProps<{
    tickets: any[];
}>();

const emit = defineEmits<{
    'edit': [ticket: any];
    'delete': [id: number];
}>();

// Table Setup
const sorting = ref<SortingState>([]);

const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        open: 'bg-green-700',
        in_progress: 'bg-blue-700',
        closed: 'bg-gray-700',
        pending: 'bg-yellow-700',
    };
    return colors[status] || 'bg-gray-700';
};

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
            const ticket = row.original;
            return h(
                'div',
                { class: 'flex flex-col gap-1' },
                [
                    h('span', { class: 'font-medium' }, ticket.title),
                    ticket.description ? h('span', { class: 'text-xs text-muted-foreground line-clamp-1' }, ticket.description) : null
                ]
            );
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => ['Status', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
            );
        },
        cell: ({ row }) => {
            const ticket = row.original;
            return h(
                Badge,
                {
                    class: ['capitalize text-white', getStatusColor(ticket.status)],
                },
                () => ticket.status.replace('_', ' ')
            );
        },
    },
    {
        accessorKey: 'client',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => ['Client', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
            );
        },
        cell: ({ row }) => {
            const client = row.original.client;
            return client ? client.name : '-';
        },
        sortingFn: (rowA, rowB) => {
            const a = rowA.original.client?.name || '';
            const b = rowB.original.client?.name || '';
            return a.localeCompare(b);
        }
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => ['Created At', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
            );
        },
        cell: ({ row }) => {
            const ticket = row.original;
            return new Date(ticket.created_at).toLocaleDateString();
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const ticket = row.original;
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
                                    onClick: () => emit('edit', ticket),
                                    class: 'cursor-pointer',
                                },
                                () => [h(Pencil, { class: 'mr-2 h-4 w-4' }), 'Edit']
                            ),
                            h(DropdownMenuSeparator),
                            h(
                                DropdownMenuItem,
                                {
                                    onClick: () => emit('delete', ticket.id),
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
        return props.tickets;
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
                            No tickets found.
                        </TableCell>
                    </TableRow>
                </template>
            </TableBody>
        </Table>
    </div>
</template>
