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
import { Timer, Play, Pause } from 'lucide-vue-next'
import { ref, onMounted, computed, watch } from 'vue'
import { useForm } from '@inertiajs/vue3'
import axios from 'axios'
import { useTimerStore } from '@/stores/timer'
import { cn } from '@/lib/utils'

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

// Use the Pinia store
const timerStore = useTimerStore()

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

    timerStore.toggleTimer()
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

    timerStore.setEndTime(new Date().toISOString())
    timerStore.setStartTime(new Date(new Date().getTime() - elapsedTime.value * 1000).toISOString())
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

// Initialize form with store values when component mounts
onMounted(() => {
    // Restore form state from store
    if (timerStore.trackableType) {
        trackableType.value = timerStore.trackableType
        form.trackable_id = timerStore.trackableId
        form.trackable_type = timerStore.trackableType
        form.start_time = timerStore.startTime || ''
        form.end_time = timerStore.endTime || ''

        // Load trackables if type is set
        if (timerStore.trackableType) {
            loadTrackables(timerStore.trackableType)
        }
    }

    // Restart timer if it was running
    if (timerStore.isRunning) {
        timerStore.startTimer()
    }
})

// here I need to watch the timerStore.isRunning and if it is true, I need to set the form.end_time to the current time and the form.start_time to the current time minus the elapsed time
watch(() => isRunning.value, (newIsRunning) => {
    if (!newIsRunning) {
        form.end_time = new Date().toISOString().slice(0, 16)
        form.start_time = new Date(new Date().getTime() - elapsedTime.value * 1000).toISOString().slice(0, 16)
    }
})

const loadTrackables = async (type: string) => {
    try {
        const response = await axios.get(route('api.time-tracking.trackables'), {
            params: {
                trackable_type: type,
            },
        });
        trackables.value = response.data;
    } catch (error) {
        console.error('Error loading trackables:', error)
    }
}

const submit = () => {
    // Use the store values for the form
    form.trackable_id = timerStore.trackableId
    form.trackable_type = timerStore.trackableType
    form.start_time = timerStore.startTime || ''
    form.end_time = timerStore.endTime || ''

    form.post(route('time-tracking.store'), {
        onSuccess: () => {
            timerStore.resetTimer()
            form.reset()

            trackableType.value = ''
            trackables.value = []
        },
        onError: () => {
            console.log('error')
        }
    })
}

watch(trackableType, async () => {
    timerStore.setTrackable(trackableType.value, '')
    form.trackable_type = trackableType.value
    if (trackableType.value) {
        await loadTrackables(trackableType.value)
    } else {
        trackables.value = []
    }
});

// Watch for trackable selection changes
watch(() => form.trackable_id, (newId) => {
    if (newId) {
        const selectedTrackable = trackables.value.find(t => t.id === newId)
        timerStore.setTrackable(trackableType.value, newId, selectedTrackable || null)
    }
})

// Watch for start/end time changes
watch(() => form.start_time, (newTime) => {
    if (newTime) {
        timerStore.setStartTime(newTime)
    }
})

watch(() => form.end_time, (newTime) => {
    if (newTime) {
        timerStore.setEndTime(newTime)
    }
})

// onUnmounted(() => {
//     // Don't cleanup the timer when component unmounts
//     // Let the store handle the timer state
//     // Only cleanup if the timer is actually stopped
//     if (!timerStore.isRunning) {
//         timerStore.cleanup()
//     }
// })

</script>

<template>
    <Dialog>
        <DialogTrigger as-child>
            <Button
                class="cursor-pointer px-4 py-1 font-bold text-white text-sm transition duration-200 hover:brightness-110"
                style="background: linear-gradient(90deg, #4B0082 0%, #90EE90 100%);">
                <span v-if="timerStore.hasActiveTimer">
                    {{ timerStore.formattedTime }}
                </span>
                <span v-else>
                    Timer
                </span>
                <Timer class="size-5" />
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
                                <SelectItem v-for="trackable in trackables" :key="trackable.id" :value="trackable.id">
                                    {{ trackable.title }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <span class="text-sm text-red-500 col-span-full" v-if="form.errors.trackable_id">
                            {{ form.errors.trackable_id }}
                        </span>
                    </div>

                    <div class="col-span-full">
                        <p class="text-2xl font-bold">{{ timerStore.formattedTime }}</p>
                    </div>

                    <div v-if="!timerStore.isRunning && timerStore.formattedTime != '00:00:00'"
                        class="grid gap-4 animate-in fade-in duration-500">
                        <div class="grid grid-cols-4 items-center gap-4">
                            <Label for="start_time" class="text-right col-span-full">Start Time</Label>
                            <Input id="start_time" v-model="form.start_time" type="datetime-local" class="col-span-4" />
                            <span class="text-sm text-red-500 col-span-full" v-if="form.errors.start_time">
                                {{ form.errors.start_time }}
                            </span>
                        </div>

                        <div class="grid grid-cols-4 items-center gap-4">
                            <Label for="end_time" class="text-right col-span-full">End Time</Label>
                            <Input id="end_time" v-model="form.end_time" type="datetime-local" class="col-span-4" />
                            <span class="text-sm text-red-500 col-span-full" v-if="form.errors.end_time">
                                {{ form.errors.end_time }}
                            </span>
                        </div>
                    </div>

                    <DialogFooter class="grid grid-cols-4 gap-2">
                        <Button type="button" class="col-span-3" variant='outline' @click="toggleTimer">
                            <Play v-if="!timerStore.isRunning" class="w-4 h-4 mr-2" />
                            <Pause v-else class="w-4 h-4 mr-2" />
                            {{ timerStore.isRunning ? 'Pause' : 'Play' }}
                        </Button>
                        <Button type="button" variant="destructive" class="col-span-1" @click="timerStore.resetTimer"
                            :disabled="timerStore.elapsedTime === 0">
                            Reset
                        </Button>
                        <Button type="submit" class="cursor-pointer col-span-full" v-if="!isRunning"
                            :disable="!isRunning">Save</Button>
                    </DialogFooter>
                </div>
            </form>
        </DialogContent>
    </Dialog>
</template>
