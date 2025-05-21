<script setup lang="ts">
// Vue and Inertia core imports
import { ref, watch } from 'vue';
import { Head, useForm, usePage } from '@inertiajs/vue3';
import { type BreadcrumbItem } from '@/types';
import { format, parseISO, differenceInSeconds } from 'date-fns';

// UI Components - Layout
import AppLayout from '@/layouts/AppLayout.vue';

// UI Components - Sheet
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetClose,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet';

// UI Components - Dialog
import { Dialog } from '@/components/ui/dialog';
import DialogTrigger from '@/components/ui/dialog/DialogTrigger.vue';
import DialogContent from '@/components/ui/dialog/DialogContent.vue';
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue';
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue';
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue';
import DialogFooter from '@/components/ui/dialog/DialogFooter.vue';
import DialogClose from '@/components/ui/dialog/DialogClose.vue';

// UI Components - Alert Dialog
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';

// UI Components - Basic Elements
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// UI Components - Select
import Select from '@/components/ui/select/Select.vue';
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue';
import SelectValue from '@/components/ui/select/SelectValue.vue';
import SelectContent from '@/components/ui/select/SelectContent.vue';
import SelectItem from '@/components/ui/select/SelectItem.vue';

// UI Components - Popover
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Third-party libraries
import axios from 'axios';

// Icons
import { EllipsisVertical } from 'lucide-vue-next';

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
    trackable_id: number | null;
    trackable_type: string;
    formatted_start_time: string;
    formatted_end_time: string;
    trackable: Trackable;
}

interface Trackable {
    id: number;
    title: string;
}

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
    selectedTimeTracking.value = timeTracking;
    trackableType.value = timeTracking.trackable_type;

    updateForm.start_time = timeTracking.formatted_start_time;
    updateForm.end_time = timeTracking.formatted_end_time;
    updateForm.trackable_id = timeTracking.trackable_id || null;
    updateForm.trackable_type = timeTracking.trackable_type;

};

const updateTimeTracking = () => {
    if (!selectedTimeTracking.value) return;

    updateForm.put(route('time-tracking.update', selectedTimeTracking.value.id), {
        onSuccess: () => {
            selectedTimeTracking.value = null;
        },
    });
};

const deleteTimeTracking = (id: number) => {
    updateForm.delete(route('time-tracking.destroy', id), {
        onSuccess: () => {
            selectedTimeTracking.value = null;
        },
    });
};

const formatDuration = (startTime: string, endTime: string | null) => {
    if (!endTime) return 'Ongoing';

    const start = parseISO(startTime);
    const end = parseISO(endTime);
    const seconds = differenceInSeconds(end, start);

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
};

watch(trackableType, async () => {
    form.trackable_type = trackableType.value;
    const response = await axios.get(route('time-tracking.trackables'), {
        params: {
            trackable_type: trackableType.value,
        },
    });
    trackables.value = response.data;
});
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
                                <SheetTitle>Create Time Tracking</SheetTitle>
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
                                    <Label for="trackable_id" class="text-right">Item</Label>
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
                    <div v-for="timeTracking in timeTrackings" :key="timeTracking.id"
                        class="group flex justify-between items-center gap-4 border-b p-4">
                        <div>
                            <!-- Status -->
                            <div class="flex">
                                <span class="font-semibold text-sm">
                                    {{ timeTracking.is_running ? 'Running' : 'Completed' }}
                                </span>
                            </div>

                            <div class="flex items-center gap-2">
                                <p class="text-gray-700 dark:text-gray-300">
                                    {{ timeTracking.trackable.title }}
                                </p>
                            </div>

                            <!-- Time Details -->
                            <div class="flex flex-col items-center flex-wrap">
                                <div class="text-gray-700 dark:text-gray-300">
                                    Start: {{ format(parseISO(timeTracking.start_time), 'PPpp') }}
                                </div>
                                <div class="text-gray-700 dark:text-gray-300">
                                    End: {{ format(parseISO(timeTracking.end_time), 'PPpp') }}
                                </div>
                            </div>

                            <!-- Total Time -->
                            <div class="text-gray-700 dark:text-gray-300">
                                Total: {{ formatDuration(timeTracking.start_time, timeTracking.end_time) }}
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex items-start justify-end">
                            <Popover>
                                <PopoverTrigger as-child>
                                    <button class="cursor-pointer p-2">
                                        <EllipsisVertical class="h-5 w-5 text-gray-900 dark:text-white" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent class="bg-sidebar absolute right-5 z-50 mt-2 w-40 rounded p-0 shadow"
                                    align="end">
                                    <Sheet>
                                        <SheetTrigger as-child>
                                            <div @click="selectTimeTracking(timeTracking)"
                                                class="dark:hover:bg-muted block w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100">
                                                Edit
                                            </div>
                                        </SheetTrigger>
                                        <SheetContent side="right" class="sm:max-w-[500px]">
                                            <SheetHeader>
                                                <SheetTitle>Edit Time Tracking</SheetTitle>
                                                <SheetDescription>Update time tracking details</SheetDescription>
                                            </SheetHeader>

                                            <form v-if="selectedTimeTracking" @submit.prevent="updateTimeTracking"
                                                class="space-y-4 mt-4 p-4">
                                                <div class="grid gap-4">

                                                    <div class="flex flex-col gap-4">
                                                        <Label for="update-trackable-type"
                                                            class="text-right">Type</Label>
                                                        <Select v-model="updateForm.trackable_type" class=""
                                                            id="update-trackable-type">
                                                            <SelectTrigger id="update-trackable-type-trigger"
                                                                class="w-full">
                                                                <SelectValue placeholder="Select" />
                                                            </SelectTrigger>
                                                            <SelectContent position="popper">
                                                                <SelectItem v-for="type in types" :key="type.label"
                                                                    :value="type.model">
                                                                    {{ type.label }}
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div class="flex flex-col gap-4" v-if="updateForm.trackable_type">
                                                        <Label for="update-trackable-id" class="text-right">Item</Label>
                                                        <Select v-model="updateForm.trackable_id" class=""
                                                            :disabled="!updateForm.trackable_type"
                                                            id="update-trackable-id">
                                                            <SelectTrigger id="update-trackable-id-trigger"
                                                                class="w-full">
                                                                <SelectValue placeholder="Select" />
                                                            </SelectTrigger>
                                                            <SelectContent position="popper">
                                                                <SelectItem v-for="trackable in trackables"
                                                                    :key="trackable.id" :value="trackable.id">
                                                                    {{ trackable.title }}
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div class="grid grid-cols-4 items-center gap-4">
                                                        <Label for="update-start_time" class="text-right">Start
                                                            Time</Label>
                                                        <Input id="update-start_time" v-model="updateForm.start_time"
                                                            class="col-span-4" type="datetime-local" />
                                                    </div>

                                                    <div class="grid grid-cols-4 items-center gap-4">
                                                        <Label for="update-end_time" class="text-right">End Time</Label>
                                                        <Input id="update-end_time" v-model="updateForm.end_time"
                                                            class="col-span-4" type="datetime-local" />
                                                    </div>
                                                </div>

                                                <div class="flex justify-end gap-2">
                                                    <SheetClose asChild>
                                                        <Button variant="outline">Cancel</Button>
                                                    </SheetClose>
                                                    <SheetClose asChild>
                                                        <Button type="submit">Save Changes</Button>
                                                    </SheetClose>
                                                </div>
                                            </form>
                                        </SheetContent>
                                    </Sheet>

                                    <Dialog>
                                        <DialogTrigger as-child>
                                            <div class="block w-full cursor-pointer px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                                                variant="destructive">
                                                Delete
                                            </div>
                                        </DialogTrigger>

                                        <DialogContent class="space-y-6">
                                            <DialogHeader class="space-y-3">
                                                <DialogTitle>Are you sure you want to delete this time tracking?
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Once your time tracking is deleted, there's no way to recover
                                                    it.
                                                </DialogDescription>
                                            </DialogHeader>

                                            <DialogFooter class="gap-2">
                                                <DialogClose as-child>
                                                    <Button variant="secondary">Cancel</Button>
                                                </DialogClose>

                                                <Button variant="destructive"
                                                    @click="deleteTimeTracking(timeTracking.id)">
                                                    Delete time tracking
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
                <div v-else class="flex h-32 items-center justify-center rounded-lg border">
                    <p class="text-gray-800 dark:text-gray-100">There are no time tracking entries yet</p>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
