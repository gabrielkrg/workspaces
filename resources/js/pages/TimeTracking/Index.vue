<script setup lang="ts">
// Vue and Inertia core imports
import { ref, watch } from 'vue';
import { Head, router, useForm } from '@inertiajs/vue3';
import { type BreadcrumbItem, type TimeTracking, type Trackable } from '@/types';
import { parseISO } from 'date-fns';

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
import { Input } from '@/components/ui/input';

// UI Components - Select
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// Custom Components
import TimeTrackingDataTable from '@/components/TimeTrackingDataTable.vue';

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

const form = useForm({
    trackable_id: '',
    trackable_type: '',
    start_time: '',
    end_time: '',
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

const updateForm = useForm({
    start_time: '',
    end_time: '',
    trackable_id: null as number | null,
    trackable_type: '',
});

const trackableType = ref('');
const trackables = ref<Trackable[]>([]);
const selectedTimeTracking = ref<TimeTracking | null>(null);

const selectTimeTracking = (timeTracking: TimeTracking) => {
    if (!timeTracking.trackable) {
        return;
    }

    selectedTimeTracking.value = timeTracking;
    trackableType.value = timeTracking.trackable_type;

    updateForm.start_time = formatDateForInput(timeTracking.start_time);
    updateForm.end_time = formatDateForInput(timeTracking.end_time);

    updateForm.trackable_id = timeTracking.trackable_id || null;
    updateForm.trackable_type = timeTracking.trackable_type;
};

const updateTimeTracking = () => {
    if (!selectedTimeTracking.value) return;

    updateForm.put(route('time-tracking.update', selectedTimeTracking.value.id), {
        onSuccess: () => {
            selectedTimeTracking.value = null;
            isEditSheetOpen.value = false;

            router.get(route('time-tracking.index'), {
                preserveState: true,
                replace: true,
            });
        },
    });
};

const deleteTimeTracking = (id: number) => {
    updateForm.delete(route('time-tracking.destroy', id), {
        onSuccess: () => {
            selectedTimeTracking.value = null;

            router.get(route('time-tracking.index'), {
                preserveState: true,
                replace: true,
            });
        },
    });
};

const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return '';
    const date = parseISO(dateString);
    return date.toISOString().slice(0, 16);
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
    selectTimeTracking(timeTracking);
    isEditSheetOpen.value = true;
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
            <div class="flex flex-wrap items-end justify-between gap-4">
                <div></div>
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

                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="start_time" class="text-right">Start Time</Label>
                                    <Input id="start_time" v-model="form.start_time" type="datetime-local"
                                        class="col-span-4" />
                                    <span class="text-sm text-red-500 col-span-full" v-if="form.errors.start_time">
                                        {{ form.errors.start_time }}
                                    </span>
                                </div>

                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="end_time" class="text-right">End Time</Label>
                                    <Input id="end_time" v-model="form.end_time" type="datetime-local"
                                        class="col-span-4" />
                                    <span class="text-sm text-red-500 col-span-full" v-if="form.errors.end_time">
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
            <Sheet v-model:open="isEditSheetOpen">
                <SheetContent side="right" class="sm:max-w-[500px]">
                    <SheetHeader>
                        <SheetTitle>Edit Time Tracking</SheetTitle>
                        <SheetDescription>Update time tracking details</SheetDescription>
                    </SheetHeader>

                    <form v-if="selectedTimeTracking" @submit.prevent="updateTimeTracking" class="space-y-4 mt-4 p-4">
                        <div class="grid gap-4">
                            <div class="flex flex-col gap-4">
                                <Label for="update-trackable-type" class="text-right">Type</Label>
                                <Select v-model="updateForm.trackable_type" id="update-trackable-type">
                                    <SelectTrigger id="update-trackable-type-trigger" class="w-full">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem v-for="type in types" :key="type.label" :value="type.model">
                                            {{ type.label }}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <span class="text-sm text-red-500 col-span-full"
                                    v-if="updateForm.errors.trackable_type">
                                    {{ updateForm.errors.trackable_type }}
                                </span>
                            </div>

                            <div class="flex flex-col gap-4" v-if="updateForm.trackable_type">
                                <Label for="update-trackable-id" class="text-right">Item</Label>
                                <Select v-model="updateForm.trackable_id" :disabled="!updateForm.trackable_type"
                                    id="update-trackable-id">
                                    <SelectTrigger id="update-trackable-id-trigger" class="w-full">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem v-for="trackable in trackables" :key="trackable.id"
                                            :value="trackable.id">
                                            {{ trackable.title }}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <span class="text-sm text-red-500 col-span-full" v-if="updateForm.errors.trackable_id">
                                    {{ updateForm.errors.trackable_id }}
                                </span>
                            </div>

                            <div class="grid grid-cols-4 items-center gap-4">
                                <Label for="update-start_time" class="text-right">Start Time</Label>
                                <Input id="update-start_time" v-model="updateForm.start_time" class="col-span-4"
                                    type="datetime-local" />
                                <span class="text-sm text-red-500 col-span-full" v-if="updateForm.errors.start_time">
                                    {{ updateForm.errors.start_time }}
                                </span>
                            </div>

                            <div class="grid grid-cols-4 items-center gap-4">
                                <Label for="update-end_time" class="text-right">End Time</Label>
                                <Input id="update-end_time" v-model="updateForm.end_time" class="col-span-4"
                                    type="datetime-local" />
                                <span class="text-sm text-red-500 col-span-full" v-if="updateForm.errors.end_time">
                                    {{ updateForm.errors.end_time }}
                                </span>
                            </div>
                        </div>

                        <div class="flex justify-end gap-2">
                            <Button variant="outline" class="cursor-pointer" type="button"
                                @click="isEditSheetOpen = false">Cancel</Button>
                            <Button type="submit" class="cursor-pointer">Save Changes</Button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>

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
