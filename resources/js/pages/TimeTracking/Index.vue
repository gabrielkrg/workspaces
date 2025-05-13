<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/vue3';
import { Sheet, SheetContent, SheetDescription, SheetClose, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Select from '@/components/ui/select/Select.vue';
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue';
import SelectValue from '@/components/ui/select/SelectValue.vue';
import SelectContent from '@/components/ui/select/SelectContent.vue';
import SelectItem from '@/components/ui/select/SelectItem.vue';
import axios from 'axios';
import { ref, watch, computed } from 'vue';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableHeader, TableBody, TableCell, TableRow, TableEmpty, TableHead } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, EllipsisVertical } from 'lucide-vue-next';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Time Tracking',
        href: '/time-tracking',
    },
];

interface TimeTracking {
    id: number;
    start_time: string;
    end_time: string;
    duration: number;
    is_running: boolean;
    formatted_start_time: string;
    formatted_end_time: string;
}

interface Trackable {
    id: number;
    title: string;
}

const props = defineProps<{
    timeTrackings: TimeTracking[];
    types: { label: string, model: string }[];
    filters?: {
        search?: string;
        type?: string;
        status?: string;
    };
}>();

const formatDate = (date: Date) => {
    return date.toISOString().slice(0, 16);
};

const form = useForm({
    trackable_id: '',
    trackable_type: '',
    start_time: formatDate(new Date()),
    end_time: formatDate(new Date()),
});

const filtersForm = useForm({
    search: props.filters?.search || '',
    type: props.filters?.type || '',
    status: props.filters?.status || '',
});

const submitFilters = () => {
    filtersForm.get(route('time-tracking.index'), {
        preserveState: true,
        replace: true,
    });
};

watch(
    () => filtersForm.type,
    () => {
        submitFilters();
    },
);

watch(
    () => filtersForm.status,
    () => {
        submitFilters();
    },
);

const submit = () => {
    form.post(route('time-tracking.store'), {
        onSuccess: () => {
            form.reset();
        },
    });
};

const trackableType = ref('');
const trackables = ref<Trackable[]>([]);

watch(trackableType, async () => {
    form.trackable_type = trackableType.value;
    const response = await axios.get(route('time-tracking.trackables'), {
        params: {
            trackable_type: trackableType.value,
        },
    });
    trackables.value = response.data;
});

const selectedTimeTracking = ref<TimeTracking | null>(null);
const showSheet = ref(false);
const showDeleteDialog = ref(false);

const updateForm = useForm({
    start_time: '',
    end_time: '',
});

const updateTimeTracking = () => {
    if (!selectedTimeTracking.value) return;

    updateForm.put(route('time-tracking.update', selectedTimeTracking.value.id), {
        onSuccess: () => {
            showSheet.value = false;
            selectedTimeTracking.value = null;
        },
    });
};

const deleteTimeTracking = () => {
    if (!selectedTimeTracking.value) return;

    updateForm.delete(route('time-tracking.destroy', selectedTimeTracking.value.id), {
        onSuccess: () => {
            showSheet.value = false;
            selectedTimeTracking.value = null;
            showDeleteDialog.value = false;
        },
    });
};

const openTimeTrackingSheet = (timeTracking: TimeTracking) => {
    selectedTimeTracking.value = timeTracking;
    updateForm.start_time = timeTracking.formatted_start_time;
    updateForm.end_time = timeTracking.formatted_end_time;
    showSheet.value = true;
};

// Calculate progress
const completed = computed(() => props.timeTrackings.filter((t) => !t.is_running).length);
const total = computed(() => props.timeTrackings.length);
const percent = computed(() => (total.value ? Math.round((completed.value / total.value) * 100) : 0));
</script>

<template>

    <Head title="Time Tracking" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div class="flex flex-wrap items-end justify-between gap-4">

                <Sheet>
                    <SheetTrigger as-child>
                        <Button variant="default" class="cursor-pointer">Create</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <form @submit.prevent="submit">
                            <SheetHeader>
                                <SheetTitle>Time Tracking</SheetTitle>
                                <SheetDescription>
                                    Fill the fields to create a new time tracking. Click save when you're done.
                                </SheetDescription>
                            </SheetHeader>

                            <div class="grid gap-4 p-4">
                                <div class="flex flex-col gap-4">
                                    <Label for="title" class="text-right">Type</Label>
                                    <Select v-model="trackableType" class="">
                                        <SelectTrigger id="role" class="w-full">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectItem v-for="type in types" :key="type.label" :value="type.model">
                                                {{ type.label }}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div class="flex flex-col gap-4" v-if="trackableType">
                                    <Label for="trackable_id" class="text-right">Trackable</Label>
                                    <Select v-model="form.trackable_id" class="" :disabled="!trackableType">
                                        <SelectTrigger id="role" class="w-full">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectItem v-for="trackable in trackables" :key="trackable.id"
                                                :value="trackable.id">
                                                {{ trackable.title }}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="start_time" class="text-right">Start Time</Label>
                                    <Input id="start_time" v-model="form.start_time" type="datetime-local"
                                        class="col-span-4" />
                                </div>

                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="end_time" class="text-right">End Time</Label>
                                    <Input id="end_time" v-model="form.end_time" type="datetime-local"
                                        class="col-span-4" />
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

            <div
                class="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min p-4">
                <div v-if="timeTrackings.length > 0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead class="w-[50px]">Status</TableHead>
                                <TableHead>Start Time</TableHead>
                                <TableHead>End Time</TableHead>
                                <TableHead class="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="timeTracking in timeTrackings" :key="timeTracking.id">
                                <TableCell>
                                    <div class="flex items-center gap-2">
                                        <div class="h-2 w-2 rounded-full"
                                            :class="timeTracking.is_running ? 'bg-green-500' : 'bg-gray-500'"></div>
                                        <span class="font-medium">{{ timeTracking.is_running ? 'Running' : 'Completed'
                                            }}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div class="text-gray-700 dark:text-gray-300">
                                        {{ new Date(timeTracking.start_time).toLocaleString() }}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div class="text-gray-700 dark:text-gray-300">
                                        {{ timeTracking.end_time ? new Date(timeTracking.end_time).toLocaleString() :
                                            'Ongoing' }}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Popover class="relative">
                                        <PopoverTrigger as-child>
                                            <button class="cursor-pointer p-2">
                                                <EllipsisVertical class="h-5 w-5 text-gray-900 dark:text-white" />
                                            </button>
                                        </PopoverTrigger>

                                        <PopoverContent
                                            class="bg-sidebar absolute right-5 z-50 mt-2 w-40 rounded p-0 shadow"
                                            align="end">
                                            <Sheet>
                                                <SheetTrigger as-child>
                                                    <SheetClose as-child>
                                                        <div @click="openTimeTrackingSheet(timeTracking)"
                                                            class="dark:hover:bg-muted block w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100">
                                                            Edit
                                                        </div>
                                                    </SheetClose>
                                                </SheetTrigger>
                                            </Sheet>
                                            <AlertDialog v-model:open="showDeleteDialog">
                                                <AlertDialogTrigger as-child>
                                                    <div
                                                        class="block w-full cursor-pointer px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900">
                                                        Delete
                                                    </div>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete
                                                            the
                                                            time tracking entry.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <Button variant="destructive"
                                                            @click="deleteTimeTracking">Delete</Button>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                <div v-else>
                    <Table>
                        <TableEmpty colspan="3">
                            <p class="text-gray-800 dark:text-gray-100">There are no time tracking entries yet</p>
                        </TableEmpty>
                    </Table>
                </div>
            </div>

            <Sheet v-model:open="showSheet">
                <SheetContent side="right" class="sm:max-w-[500px]">
                    <SheetHeader v-if="selectedTimeTracking">
                        <SheetTitle>Edit Time Tracking</SheetTitle>
                        <SheetDescription>Update time tracking details</SheetDescription>
                    </SheetHeader>
                    <form v-if="selectedTimeTracking" @submit.prevent="updateTimeTracking" class="space-y-4 mt-4 p-4">
                        <div class="grid gap-4">
                            <div class="grid grid-cols-4 items-center gap-4">
                                <Label for="update-start-time" class="text-right">Start Time</Label>
                                <Input id="update-start-time" v-model="updateForm.start_time" type="datetime-local"
                                    class="col-span-3" />
                            </div>

                            <div class="grid grid-cols-4 items-center gap-4">
                                <Label for="update-end-time" class="text-right">End Time</Label>
                                <Input id="update-end-time" v-model="updateForm.end_time" type="datetime-local"
                                    class="col-span-3" />
                            </div>
                        </div>

                        <div class="flex justify-end gap-2 mt-6">
                            <SheetClose as-child>
                                <Button variant="outline">Cancel</Button>
                            </SheetClose>
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    </AppLayout>
</template>
