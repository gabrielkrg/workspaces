<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import { Sheet, SheetContent, SheetDescription, SheetClose, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/vue3';
import Select from '@/components/ui/select/Select.vue';
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue';
import SelectValue from '@/components/ui/select/SelectValue.vue';
import SelectContent from '@/components/ui/select/SelectContent.vue';
import SelectItem from '@/components/ui/select/SelectItem.vue';
import axios from 'axios';
import { ref, watch } from 'vue';

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
}

interface Trackable {
    id: number;
    name: string;
}

const props = defineProps<{
    timeTrackings: TimeTracking[];
    types: { label: string, model: string }[];
}>();

const form = useForm({
    title: '',
    description: '',
    trackable_id: '',
    trackable_type: '',
    start_time: '',
    end_time: '',
    duration: '',
});

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
        <div class="flex-col gap-4 rounded-xl p-4">
            <div>
                <Sheet>
                    <SheetTrigger as-child>
                        <Button variant="default" class="cursor-pointer"> Create </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <form @submit.prevent="submit">
                            <SheetHeader>
                                <SheetTitle>Time Tracking</SheetTitle>
                                <SheetDescription> Fill the fields to create a new time tracking. Click save when you're
                                    done.
                                </SheetDescription>
                            </SheetHeader>

                            <div class="grid gap-4 p-4">
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="title" class="text-right"> Title </Label>
                                    <Input id="title" v-model="form.title" class="col-span-4" />
                                </div>

                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="description" class="text-right"> Description </Label>
                                    <Textarea id="description" v-model="form.description"
                                        placeholder="Type your description here." class="col-span-4" />
                                </div>

                                <div class="flex flex-col gap-4">
                                    <Label for="title" class="text-right"> Type </Label>
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

                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="trackable_id" class="text-right"> Trackable </Label>
                                    <Select v-model="form.trackable_id" class="">
                                        <SelectTrigger id="role" class="w-full">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectItem v-for="trackable in trackables" :key="trackable.id"
                                                :value="trackable.id">
                                                {{ trackable.name }}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="start_time" class="text-right"> Start Time </Label>
                                    <Input id="start_time" v-model="form.start_time" type="datetime-local"
                                        class="col-span-4" />
                                </div>

                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="end_time" class="text-right"> End Time </Label>
                                    <Input id="end_time" v-model="form.end_time" type="datetime-local"
                                        class="col-span-4" />
                                </div>

                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="duration" class="text-right"> Duration (minutes) </Label>
                                    <Input id="duration" v-model="form.duration" type="number" class="col-span-4" />
                                </div>
                            </div>

                            <SheetFooter>
                                <SheetClose as-child>
                                    <Button type="submit" class="cursor-pointer"> Save </Button>
                                </SheetClose>
                            </SheetFooter>
                        </form>
                    </SheetContent>
                </Sheet>

            </div>
            <div class="grid auto-rows-min gap-4 md:grid-cols-3">
                <div v-for="timeTracking in timeTrackings" :key="timeTracking.id">
                    <div>
                        {{ timeTracking.start_time }}
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
