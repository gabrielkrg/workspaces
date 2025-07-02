<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Timer, Play, Pause } from 'lucide-vue-next'
import { ref, onUnmounted, computed, watch } from 'vue'
import { useForm } from '@inertiajs/vue3'
import axios from 'axios'

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





// Timer state
const isRunning = ref(false)
const elapsedTime = ref(0)
const intervalId = ref<number | null>(null)

// Format time as HH:MM:SS
const formattedTime = computed(() => {
    const hours = Math.floor(elapsedTime.value / 3600)
    const minutes = Math.floor((elapsedTime.value % 3600) / 60)
    const seconds = elapsedTime.value % 60

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// Start or pause timer
const toggleTimer = () => {
    if (isRunning.value) {
        pauseTimer()
    } else {
        startTimer()
    }
}

// Start timer
const startTimer = () => {
    if (!isRunning.value) {
        isRunning.value = true
        intervalId.value = setInterval(() => {
            elapsedTime.value++
        }, 1000)
    }
}

// Pause timer
const pauseTimer = () => {
    if (isRunning.value) {
        isRunning.value = false
        if (intervalId.value) {
            clearInterval(intervalId.value)
            intervalId.value = null
        }
    }
}

// Reset timer
const resetTimer = () => {
    pauseTimer()
    elapsedTime.value = 0
}

const types = [
    {
        label: 'Task',
        model: 'App\\Models\\Task'
    },
    {
        label: 'Card',
        model: 'App\\Models\\Card'
    },
    {
        label: 'Kanban',
        model: 'App\\Models\\Kanban'
    },
    {
        label: 'Workspace',
        model: 'App\\Models\\Workspace'
    }
];

const trackableType = ref('');
const trackables = ref<Trackable[]>([]);

const form = useForm({
    trackable_id: '',
    trackable_type: '',
    start_time: '',
    end_time: '',
});

const submit = () => {
    form.post(route('time-trackings.store'), {
        onSuccess: () => {
            console.log('success')
        }
    })
}

watch(trackableType, async () => {
    form.trackable_type = trackableType.value;
    const response = await axios.get(route('time-tracking.trackables'), {
        params: {
            trackable_type: trackableType.value,
        },
    });
    trackables.value = response.data;
});

onUnmounted(() => {
    if (intervalId.value) {
        clearInterval(intervalId.value)
    }
})

</script>

<template>
    <div class="fixed top-5 right-10 z-40">
        <Dialog>
            <DialogTrigger as-child>
                <Button variant="default" class="rounded-full cursor-pointer">
                    <Timer class="text-white dark:text-black" />
                    Timer
                </Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Timer</DialogTitle>
                    <DialogDescription>
                        Start a timer for your task.
                    </DialogDescription>
                </DialogHeader>

                <form @submit.prevent="submit">
                    <div class="grid gap-4">
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

                        <div class="col-span-full">
                            <p class="text-2xl font-bold">{{ formattedTime }}</p>
                        </div>

                        <div v-if="!isRunning" class="grid gap-4 animate-in fade-in duration-500">
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
                                <Input id="end_time" v-model="form.end_time" type="datetime-local" class="col-span-4" />
                                <span class="text-sm text-red-500 col-span-full" v-if="form.errors.end_time">
                                    {{ form.errors.end_time }}
                                </span>
                            </div>
                        </div>

                        <DialogFooter class="flex gap-2">
                            <Button type="button" class="flex-1" variant='outline' @click="toggleTimer">
                                <Play v-if="!isRunning" class="w-4 h-4 mr-2" />
                                <Pause v-else class="w-4 h-4 mr-2" />
                                {{ isRunning ? 'Pause' : 'Play' }}
                            </Button>
                            <Button type="submit" class="cursor-pointer">Save</Button>
                            <Button type="button" variant="destructive" @click="resetTimer"
                                :disabled="elapsedTime.value === 0">
                                Reset
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    </div>
</template>