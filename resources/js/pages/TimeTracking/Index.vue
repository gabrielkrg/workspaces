<script setup lang="ts">
// Vue and Inertia core imports
import { ref, watch } from 'vue';
import { Head, router, useForm } from '@inertiajs/vue3';
import { type BreadcrumbItem } from '@/types';
import { parseISO, differenceInSeconds } from 'date-fns';

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
        // Optionally show an alert or handle the case where trackable is null
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

const formatDuration = (startTime: string, endTime: string | null) => {
    if (!endTime) return 'Ongoing';

    const start = parseISO(startTime);
    const end = parseISO(endTime);
    const seconds = differenceInSeconds(end, start);

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
};

const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return '';
    const date = parseISO(dateString);
    return date.toISOString().slice(0, 16);
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
                                    <span class="text-sm text-red-500 col-span-full" v-if="form.errors.trackable_type">
                                        {{ form.errors.trackable_type }}
                                    </span>
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

            <div class="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min p-4"
                v-if="timeTrackings.length > 0">
                <ul role="list" class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                    <li class="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-sidebar sm:px-6 lg:px-8 dark:text-white text-black"
                        v-for="timeTracking in timeTrackings" :key="timeTracking.id">
                        <div class="flex min-w-0 gap-x-4">
                            <div class="min-w-0 flex-auto">
                                <p class="mt-1 flex text-xs/5">
                                    {{types.find(type => type.model === timeTracking.trackable_type)?.label}}
                                </p>
                                <p class="text-md font-semibold">
                                    {{ timeTracking.trackable?.title || 'Deleted Item' }}
                                </p>
                            </div>
                        </div>
                        <div class="flex shrink-0 gap-x-4">
                            <div class="hidden sm:flex sm:flex-col sm:items-end">
                                <p class="mt-1 text-xs">
                                    Start: {{ timeTracking.formatted_start_time }}
                                </p>
                                <p class="mt-1 text-xs">End: {{ timeTracking.formatted_end_time }}</p>

                                <p class="text-sm">
                                    Total: {{ formatDuration(timeTracking.start_time, timeTracking.end_time) }}
                                </p>
                            </div>

                            <!-- Actions -->
                            <div class="flex items-start justify-end size-5 flex-none text-gray-400 z-40">
                                <Popover>
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
                                                <div @click="selectTimeTracking(timeTracking)"
                                                    class="dark:hover:bg-muted block w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100"
                                                    :class="{ 'opacity-50 cursor-not-allowed': !timeTracking.trackable }">
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
                                                            <span class="text-sm text-red-500 col-span-full"
                                                                v-if="updateForm.errors.trackable_type">
                                                                {{ updateForm.errors.trackable_type }}
                                                            </span>
                                                        </div>

                                                        <div class="flex flex-col gap-4"
                                                            v-if="updateForm.trackable_type">
                                                            <Label for="update-trackable-id"
                                                                class="text-right">Item</Label>
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
                                                            <span class="text-sm text-red-500 col-span-full"
                                                                v-if="updateForm.errors.trackable_id">
                                                                {{ updateForm.errors.trackable_id }}
                                                            </span>
                                                        </div>

                                                        <div class="grid grid-cols-4 items-center gap-4">
                                                            <Label for="update-start_time" class="text-right">Start
                                                                Time</Label>
                                                            <Input id="update-start_time"
                                                                v-model="updateForm.start_time" class="col-span-4"
                                                                type="datetime-local" />
                                                            <span class="text-sm text-red-500 col-span-full"
                                                                v-if="updateForm.errors.start_time">
                                                                {{ updateForm.errors.start_time }}
                                                            </span>
                                                        </div>

                                                        <div class="grid grid-cols-4 items-center gap-4">
                                                            <Label for="update-end_time" class="text-right">End
                                                                Time</Label>
                                                            <Input id="update-end_time" v-model="updateForm.end_time"
                                                                class="col-span-4" type="datetime-local" />
                                                            <span class="text-sm text-red-500 col-span-full"
                                                                v-if="updateForm.errors.end_time">
                                                                {{ updateForm.errors.end_time }}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div class="flex justify-end gap-2">
                                                        <DialogClose as-child>
                                                            <Button variant="outline" class="cursor-pointer"
                                                                type="button">Cancel</Button>
                                                        </DialogClose>
                                                        <Button type="submit" class="cursor-pointer">Save
                                                            Changes</Button>
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
                                                        <Button variant="secondary" class="cursor-pointer"
                                                            type="button">Cancel</Button>
                                                    </DialogClose>

                                                    <Button variant="destructive" class="cursor-pointer" type="button"
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
                    </li>
                </ul>
            </div>
            <div v-else class="flex h-32 items-center justify-center rounded-lg border">
                <p class="text-gray-800 dark:text-gray-100">There are no time tracking entries yet</p>
            </div>
        </div>
    </AppLayout>
</template>
