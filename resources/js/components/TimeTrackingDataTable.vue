<script setup lang="ts">
import { ref, watch, h } from 'vue';
import { type TimeTracking, type Trackable, type Client } from '@/types';
import { parseISO, differenceInSeconds } from 'date-fns';

// TanStack Vue Table
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

// UI Components - Table
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

// UI Components - DropdownMenu
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// UI Components - Basic Elements
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

// UI Components - Select
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// Icons
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from 'lucide-vue-next';

const props = defineProps<{
    timeTrackings: TimeTracking[];
    types: { label: string; model: string }[];
}>();

const emit = defineEmits<{
    edit: [timeTracking: TimeTracking];
    delete: [id: number];
}>();

const formatDuration = (startTime: string, endTime: string | null) => {
    if (!endTime) return 'Ongoing';

    const start = parseISO(startTime);
    const end = parseISO(endTime);
    const seconds = differenceInSeconds(end, start);

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
};

const getTypeLabel = (model: string) => {
    return props.types.find((type) => type.model === model)?.label || model;
};

// Table Setup
const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const typeFilter = ref<string>('all');

const columns: ColumnDef<TimeTracking>[] = [
    {
        accessorKey: 'trackable_type',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => ['Type', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
            );
        },
        cell: ({ row }) => getTypeLabel(row.getValue('trackable_type')),
        filterFn: (row, id, value) => {
            if (value === 'all') return true;
            return row.getValue(id) === value;
        },
    },
    {
        accessorKey: 'trackable',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => ['Item', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
            );
        },
        cell: ({ row }) => {
            const trackable = row.getValue('trackable') as Trackable | null;
            return trackable?.title || 'Deleted Item';
        },
        sortingFn: (rowA, rowB) => {
            const a = (rowA.getValue('trackable') as Trackable | null)?.title || '';
            const b = (rowB.getValue('trackable') as Trackable | null)?.title || '';
            return a.localeCompare(b);
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
            const trackable = row.getValue('trackable') as Trackable | null;
            const client = trackable?.client as Client;
            return client?.name || '-';
        },
        sortingFn: (rowA, rowB) => {
            const a = (rowA.getValue('trackable') as Trackable | null)?.title || '';
            const b = (rowB.getValue('trackable') as Trackable | null)?.title || '';
            return a.localeCompare(b);
        },
    },
    {
        accessorKey: 'start_time',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => ['Start Time', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
            );
        },
        cell: ({ row }) => row.original.formatted_start_time_local,
    },
    {
        accessorKey: 'end_time',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => ['End Time', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
            );
        },
        cell: ({ row }) => row.original.formatted_end_time_local,
    },
    {
        id: 'duration',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => ['Duration', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
            );
        },
        cell: ({ row }) => formatDuration(row.original.start_time, row.original.end_time),
        sortingFn: (rowA, rowB) => {
            const getDuration = (row: typeof rowA) => {
                if (!row.original.end_time) return Infinity;
                const start = parseISO(row.original.start_time);
                const end = parseISO(row.original.end_time);
                return differenceInSeconds(end, start);
            };
            return getDuration(rowA) - getDuration(rowB);
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const timeTracking = row.original;
            return h('div', { class: 'text-right' }, [
                h(
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
                                        onClick: () => {
                                            if (timeTracking.trackable) {
                                                emit('edit', timeTracking);
                                            }
                                        },
                                        disabled: !timeTracking.trackable,
                                        class: 'cursor-pointer',
                                    },
                                    () => [h(Pencil, { class: 'mr-2 h-4 w-4' }), 'Edit']
                                ),
                                h(DropdownMenuSeparator),
                                h(
                                    DropdownMenuItem,
                                    {
                                        onClick: () => {
                                            emit('delete', timeTracking.id);
                                        },
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
        return props.timeTrackings;
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: (updaterOrValue) => {
        sorting.value =
            typeof updaterOrValue === 'function' ? updaterOrValue(sorting.value) : updaterOrValue;
    },
    onColumnFiltersChange: (updaterOrValue) => {
        columnFilters.value =
            typeof updaterOrValue === 'function'
                ? updaterOrValue(columnFilters.value)
                : updaterOrValue;
    },
    state: {
        get sorting() {
            return sorting.value;
        },
        get columnFilters() {
            return columnFilters.value;
        },
    },
});

// Watch type filter and update column filter
watch(typeFilter, (newValue) => {
    table.getColumn('trackable_type')?.setFilterValue(newValue);
});
</script>

<template>
    <div class="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
        <!-- Filter -->
        <div class="flex items-center gap-4 p-4 border-b border-sidebar-border/70 dark:border-sidebar-border">
            <div class="flex items-center gap-2">
                <Label for="type-filter" class="text-sm whitespace-nowrap sr-only">Filter by Type:</Label>
                <Select v-model="typeFilter">
                    <SelectTrigger id="type-filter" class="w-[180px]">
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem v-for="type in types" :key="type.model" :value="type.model">
                            {{ type.label }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <!-- Table -->
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
                            No time tracking entries found.
                        </TableCell>
                    </TableRow>
                </template>
            </TableBody>
        </Table>
    </div>
</template>
