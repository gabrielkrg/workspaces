<script setup lang="ts">
// Vue and Inertia core imports
import { ref, watch } from 'vue';
import { Head, router, useForm, usePage } from '@inertiajs/vue3';
import { type BreadcrumbItem, type TimeTracking, type Trackable } from '@/types';

// UI Components - Layout
import AppLayout from '@/layouts/AppLayout.vue';

// UI Components - Sheet
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet';
// Note: Some sheet components used by Create sheet, Edit sheet uses EditTimeTrackingSheet component

// UI Components - Dialog
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

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

// UI Components - DateTimePicker
import { DateTimePicker } from '@/components/ui/date-time-picker';

// Custom Components
import TimeTrackingDataTable from '@/components/TimeTrackingDataTable.vue';
import EditTimeTrackingSheet from '@/components/EditTimeTrackingSheet.vue';

// Third-party libraries
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Time Tracking',
        href: '/time-tracking',
    },
];

const props = defineProps<{
    timeTrackings: TimeTracking[];
    types: { label: string, model: string }[];
}>();

const page = usePage();
const workspaceTimezone = page.props.workspaceTimezone;

const now = new Date();
const nowInWorkspaceTimezone = new Date(now.toLocaleString('en-US', { timeZone: workspaceTimezone as string }));

function toLocalDateTimeString(date: Date) {
    return date.getFullYear() +
        '-' + String(date.getMonth() + 1).padStart(2, '0') +
        '-' + String(date.getDate()).padStart(2, '0') +
        'T' + String(date.getHours()).padStart(2, '0') +
        ':' + String(date.getMinutes()).padStart(2, '0');
}

const form = useForm({
    trackable_id: '',
    trackable_type: '',
    start_time: toLocalDateTimeString(nowInWorkspaceTimezone),
    end_time: toLocalDateTimeString(nowInWorkspaceTimezone),
});

const submit = () => {
    form.post(route('time-tracking.store'), {
        onSuccess: () => {
            form.reset();

            router.get(route('time-tracking.index'), {
                preserveState: true,
                replace: true,
            });
        },
    });
};

const trackableType = ref('');
const trackables = ref<Trackable[]>([]);
const selectedTimeTracking = ref<TimeTracking | null>(null);

const deleteTimeTracking = (id: number) => {
    router.delete(route('time-tracking.destroy', id), {
        onSuccess: () => {
            selectedTimeTracking.value = null;

            router.get(route('time-tracking.index'), {
                preserveState: true,
                replace: true,
            });
        },
    });
};

watch(trackableType, async () => {
    form.trackable_type = trackableType.value;
    const response = await axios.get(route('api.time-tracking.trackables'), {
        params: {
            trackable_type: trackableType.value,
        },
    });
    trackables.value = response.data;
});

// State for edit sheet and delete dialog
const isEditSheetOpen = ref(false);
const isDeleteDialogOpen = ref(false);
const timeTrackingToDelete = ref<number | null>(null);

const handleEdit = (timeTracking: TimeTracking) => {
    selectedTimeTracking.value = timeTracking;
    isEditSheetOpen.value = true;
};

const onEditSuccess = () => {
    selectedTimeTracking.value = null;
    router.get(route('time-tracking.index'), {
        preserveState: true,
        replace: true,
    });
};

const handleDelete = (id: number) => {
    timeTrackingToDelete.value = id;
    isDeleteDialogOpen.value = true;
};

const confirmDelete = () => {
    if (timeTrackingToDelete.value) {
        deleteTimeTracking(timeTrackingToDelete.value);
        isDeleteDialogOpen.value = false;
        timeTrackingToDelete.value = null;
    }
};


</script>

<template>

    <Head title="Time Tracking" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div class="flex flex-wrap items-end justify-end gap-4">
                <Sheet>
                    <SheetTrigger as-child>
                        <Button variant="default" class="cursor-pointer">Create</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <form @submit.prevent="submit">
                            <SheetHeader>
                                <SheetTitle>Create Time Tracking</SheetTitle>
                                <SheetDescription>
                                    Fill the fields to create a new time tracking. Click save when you're done.
                                </SheetDescription>
                            </SheetHeader>

                            <div class="grid gap-4 p-4">
                                <div class="flex flex-col gap-4">
                                    <Label for="title" class="text-right">Type</Label>
                                    <Select v-model="trackableType">
                                        <SelectTrigger id="role" class="w-full">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectItem v-for="type in types" :key="type.label" :value="type.model">
                                                {{ type.label }}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <span class="text-sm text-red-500 col-span-full" v-if="form.errors.trackable_type">
                                        {{ form.errors.trackable_type }}
                                    </span>
                                </div>

                                <div class="flex flex-col gap-4" v-if="trackableType">
                                    <Label for="trackable_id" class="text-right">Item</Label>
                                    <Select v-model="form.trackable_id" :disabled="!trackableType">
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
                                    <span class="text-sm text-red-500 col-span-full" v-if="form.errors.trackable_id">
                                        {{ form.errors.trackable_id }}
                                    </span>
                                </div>

                                <!-- Start Time -->
                                <div class="flex flex-col gap-2">
                                    <Label for="edit-start-time">Start Time</Label>
                                    <DateTimePicker id="edit-start-time" v-model="form.start_time"
                                        placeholder="Select start date and time" />
                                    <span class="text-sm text-red-500" v-if="form.errors.start_time">
                                        {{ form.errors.start_time }}
                                    </span>
                                </div>

                                <!-- End Time -->
                                <div class="flex flex-col gap-2">
                                    <Label for="edit-end-time">End Time</Label>
                                    <DateTimePicker id="edit-end-time" v-model="form.end_time"
                                        placeholder="Select end date and time" />
                                    <span class="text-sm text-red-500" v-if="form.errors.end_time">
                                        {{ form.errors.end_time }}
                                    </span>
                                </div>
                            </div>

                            <SheetFooter>
                                <Button type="submit" class="cursor-pointer">Save</Button>
                            </SheetFooter>
                        </form>
                    </SheetContent>
                </Sheet>
            </div>

            <!-- DataTable Component -->
            <TimeTrackingDataTable :time-trackings="props.timeTrackings" :types="props.types" @edit="handleEdit"
                @delete="handleDelete" />

            <!-- Edit Sheet -->
            <EditTimeTrackingSheet v-model:open="isEditSheetOpen" :time-tracking="selectedTimeTracking"
                :types="props.types" @success="onEditSuccess" />

            <!-- Delete Confirmation Dialog -->
            <Dialog v-model:open="isDeleteDialogOpen">
                <DialogContent class="space-y-6">
                    <DialogHeader class="space-y-3">
                        <DialogTitle>Are you sure you want to delete this time tracking?</DialogTitle>
                        <DialogDescription>
                            Once your time tracking is deleted, there's no way to recover it.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter class="gap-2">
                        <Button variant="secondary" class="cursor-pointer" type="button"
                            @click="isDeleteDialogOpen = false">Cancel</Button>
                        <Button variant="destructive" class="cursor-pointer" type="button" @click="confirmDelete">
                            Delete time tracking
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    </AppLayout>
</template>
