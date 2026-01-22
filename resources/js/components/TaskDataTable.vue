<script setup lang="ts">
import { ref, h } from 'vue';
import { type Client } from '@/types';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
    ArrowUpDown,
    MoreHorizontal,
    Pencil,
    Trash2,
    Highlighter,
    Kanban,
} from 'lucide-vue-next';
import { Link } from '@inertiajs/vue3';
import StartTimer from '@/components/StartTimer.vue';

const props = defineProps<{
    tasks: any[];
}>();

const emit = defineEmits<{
    'edit': [task: any];
    'delete': [id: number];
    'toggle-done': [task: any];
    'toggle-highlight': [task: any];
}>();

// Table Setup
const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);

const columns: ColumnDef<any>[] = [
    {
        id: 'done',
        header: 'Done',
        cell: ({ row }) => {
            const task = row.original;
            return h(
                'div',
                { class: 'flex items-center justify-start' },
                h(Checkbox, {
                    modelValue: !!task.done,
                    'onUpdate:modelValue': (val: any) => {
                        emit('toggle-done', task);
                    },
                    class: 'cursor-pointer'
                })
            );
        },
        enableSorting: false,
    },
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
            const task = row.original;
            return h(
                'div',
                {
                    class: ['inline-flex flex-col gap-1'],
                },
                [
                    h('span', {
                        class: [
                            'font-medium',
                            task.done ? 'line-through text-muted-foreground' : '',
                            task.highlight ? 'bg-green-200 dark:bg-green-900/50' : ''
                        ]
                    }, task.title),
                    task.description ? h('span', { class: 'text-xs text-muted-foreground line-clamp-1' }, task.description) : null
                ]
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
            const client = row.original.client as Client;
            return client ? client.name : '-';
        },
        sortingFn: (rowA, rowB) => {
            const a = rowA.original.client?.name || '';
            const b = rowB.original.client?.name || '';
            return a.localeCompare(b);
        }
    },
    {
        accessorKey: 'tags',
        header: 'Tags',
        cell: ({ row }) => {
            const tags = row.original.tags || [];
            return h(
                'div',
                { class: 'flex flex-wrap gap-1' },
                tags.map((tag: any) => h(
                    Badge,
                    {
                        variant: 'secondary',
                        class: 'text-xs font-normal capitalize cursor-default text-primary-foreground',
                        style: tag.color ? { backgroundColor: tag.color } : {}
                    },
                    () => tag.name
                ))
            );
        },
    },
    {
        accessorKey: 'repeat',
        header: 'Repeat',
        cell: ({ row }) => {
            const repeat = row.original.repeat;
            if (!repeat || repeat === 'none') return h(Badge, { variant: 'outline', class: 'capitalize' }, () => 'Never');
            return h(Badge, { variant: 'secondary', class: 'capitalize' }, () => repeat);
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const task = row.original;
            return h('div', { class: 'flex items-center justify-end gap-2' }, [
                task.kanban_id ? h(
                    Link,
                    {
                        href: route('kanban.show', { kanban: task.kanban_id }),
                        class: 'cursor-pointer p-2 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-md text-gray-900 dark:text-white'
                    },
                    () => h(Kanban, { class: 'h-4 w-4' })
                ) : null,
                h(
                    Button,
                    {
                        variant: 'ghost',
                        size: 'icon',
                        class: [
                            'h-8 w-8',
                            task.highlight ? 'bg-accent text-accent-foreground' : ''
                        ],
                        onClick: () => emit('toggle-highlight', task)
                    },
                    () => h(Highlighter, { class: 'h-4 w-4' })
                ),
                h(
                    DropdownMenu,
                    {},
                    {
                        default: () => [
                            h(StartTimer, { trackable_id: task.id, trackable_type: 'App\\Models\\Task' }),
                            h(DropdownMenuTrigger, { asChild: true }, () =>
                                h(Button, { variant: 'ghost', class: 'h-8 w-8 p-0' }, () =>
                                    h(MoreHorizontal, { class: 'h-4 w-4' })
                                )
                            ),
                            h(DropdownMenuContent, { align: 'end' }, () => [
                                h(
                                    DropdownMenuItem,
                                    {
                                        onClick: () => emit('edit', task),
                                        class: 'cursor-pointer',
                                    },
                                    () => [h(Pencil, { class: 'mr-2 h-4 w-4' }), 'Edit']
                                ),
                                h(DropdownMenuSeparator),
                                h(
                                    DropdownMenuItem,
                                    {
                                        onClick: () => emit('delete', task.id),
                                        class: 'cursor-pointer text-red-600 focus:text-red-600',
                                    },
                                    () => [h(Trash2, { class: 'mr-2 h-4 w-4' }), 'Delete']
                                ),
                            ]),
                        ],
                    }
                ),
            ]);
        },
    },
];

const table = useVueTable({
    get data() {
        return props.tasks;
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
                        :data-state="row.getIsSelected() && 'selected'" :class="{ 'bg-muted/50': row.original.done }">
                        <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                        </TableCell>
                    </TableRow>
                </template>
                <template v-else>
                    <TableRow>
                        <TableCell :colspan="columns.length" class="h-24 text-center">
                            No tasks found.
                        </TableCell>
                    </TableRow>
                </template>
            </TableBody>
        </Table>
    </div>
</template>
