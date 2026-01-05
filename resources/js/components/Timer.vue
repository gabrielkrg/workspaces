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
import { Timer, Play, Pause, RotateCcw } from 'lucide-vue-next'
import { ref, watch, onMounted } from 'vue'
import { useForm } from '@inertiajs/vue3'
import axios from 'axios'
import type { Trackable } from '@/types'
import { useTimerStore } from '@/stores/timer'
import { router } from '@inertiajs/vue3'

const trackableType = ref('');
const trackables = ref<Trackable[]>([]);

const timerStore = useTimerStore();

const timeTrackingId = ref<number | null>(null);
const isDialogOpen = ref(false);

onMounted(async () => {
    if (timerStore.timeTrackingId) {
        try {
            // Usa o ID da store diretamente
            timeTrackingId.value = timerStore.timeTrackingId
            const response = await axios.get(route('api.time-tracking.show', timerStore.timeTrackingId))
            const timeTracking = response.data

            // Primeiro define o tipo para carregar os trackables
            if (timeTracking.trackable_type) {
                trackableType.value = timeTracking.trackable_type
                form.trackable_type = timeTracking.trackable_type
                // Aguarda os trackables serem carregados
                await loadTrackables(timeTracking.trackable_type)
            }

            // Depois preenche o formulário com os dados
            form.start_time = timeTracking.start_time ? new Date(timeTracking.start_time).toISOString().slice(0, 16) : ''
            form.end_time = timeTracking.end_time ? new Date(timeTracking.end_time).toISOString().slice(0, 16) : ''
            form.trackable_id = timeTracking.trackable_id || ''
        } catch (error) {
            console.error('Error loading time tracking:', error)
        }
    }
})

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

const form = useForm({
    trackable_id: '',
    trackable_type: '',
    start_time: '',
    end_time: '',
    is_running: false as boolean,
});


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
    form.is_running = timerStore.isRunning;

    form.put(route('time-tracking.update', timeTrackingId.value as number), {
        onSuccess: () => {
            form.reset()

            trackableType.value = ''
            trackables.value = []
            timeTrackingId.value = null

            timerStore.resetTimer()
            isDialogOpen.value = false
        },
        onError: () => {
            console.log('error')
        }
    })
}

const reset = () => {

    if (!timeTrackingId.value) {

        console.log(timeTrackingId.value)
        return;
    }


    timerStore.resetTimer()
    form.reset()
    trackableType.value = ''
    trackables.value = []


    router.delete(route('time-tracking.destroy', timeTrackingId.value as number), {
        onSuccess: () => {
            timeTrackingId.value = null
            isDialogOpen.value = false
            router.get(route('time-tracking.index'), {
                preserveState: true,
                replace: true,
            });
        }
    })
}

const start = async () => {
    try {
        const response = await axios.post(route('api.time-tracking.start'), {
            trackable_id: form.trackable_id,
            trackable_type: form.trackable_type,
        })

        const id = response.data.id
        timeTrackingId.value = id
        timerStore.setTimeTrackingId(id)
        timerStore.startTimer()

        // Busca os dados completos do time tracking
        const showResponse = await axios.get(route('api.time-tracking.show', id))
        const timeTracking = showResponse.data

        // Primeiro define o tipo para carregar os trackables
        if (timeTracking.trackable_type) {
            trackableType.value = timeTracking.trackable_type
            form.trackable_type = timeTracking.trackable_type
            // Aguarda os trackables serem carregados
            await loadTrackables(timeTracking.trackable_type)
        }

        // Depois preenche o formulário com os dados retornados
        form.start_time = timeTracking.start_time ? new Date(timeTracking.start_time).toISOString().slice(0, 16) : ''
        form.end_time = timeTracking.end_time ? new Date(timeTracking.end_time).toISOString().slice(0, 16) : ''
        form.trackable_id = timeTracking.trackable_id || ''
    } catch (error) {
        console.error('Error starting time tracking:', error)
    }
}

watch(trackableType, async () => {
    form.trackable_type = trackableType.value
    if (trackableType.value) {
        await loadTrackables(trackableType.value)
    } else {
        trackables.value = []
    }
});

watch(() => timerStore.isRunning, (isRunning) => {
    if (!isRunning && form.start_time) {
        // Quando pausa, calcula o end_time baseado no start_time + elapsedTime
        // Converte o datetime-local para Date considerando o timezone local
        const startTimeStr = form.start_time.replace('T', ' ')
        const [datePart, timePart] = startTimeStr.split(' ')
        const [year, month, day] = datePart.split('-').map(Number)
        const [hours, minutes] = timePart.split(':').map(Number)

        const startTime = new Date(year, month - 1, day, hours, minutes, 0)
        const endTime = new Date(startTime.getTime() + (timerStore.elapsedTime * 1000))

        // Formata para datetime-local (YYYY-MM-DDTHH:mm)
        const endYear = endTime.getFullYear()
        const endMonth = String(endTime.getMonth() + 1).padStart(2, '0')
        const endDay = String(endTime.getDate()).padStart(2, '0')
        const endHours = String(endTime.getHours()).padStart(2, '0')
        const endMinutes = String(endTime.getMinutes()).padStart(2, '0')

        form.end_time = `${endYear}-${endMonth}-${endDay}T${endHours}:${endMinutes}`
    }
});


</script>

<template>
    <Dialog v-model="isDialogOpen">
        <DialogTrigger as-child>
            <Button variant="secondary">
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

                    <div v-if="timerStore.timeTrackingId">
                        <div class="grid gap-4">
                            <div class="grid grid-cols-4 items-center gap-4">
                                <Label for="start_time" class="text-right col-span-full">Start Time</Label>
                                <Input id="start_time" v-model="form.start_time" type="datetime-local"
                                    class="col-span-4" />
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
                    </div>

                    <DialogFooter>

                        <div class="flex gap-2">
                            <div v-if="timerStore.timeTrackingId">
                                <p class="text-3xl font-bold">{{ timerStore.formattedTime }}</p>
                                <div class="flex gap-2">
                                    <Button type="button" @click="timerStore.toggleTimer" variant="secondary">
                                        <Play v-if="!timerStore.isRunning" class="size-4 mr-2" />
                                        <Pause v-else class="size-4 mr-2" />
                                        {{ timerStore.isRunning ? 'Pause' : 'Play' }}
                                    </Button>

                                    <Button type="button" variant="destructive" @click="reset()">
                                        <RotateCcw class="size-4 mr-2" />
                                        Reset
                                    </Button>
                                </div>
                            </div>

                            <Button type="button" @click="start()" v-if="!timerStore.timeTrackingId">
                                Start
                            </Button>

                            <div v-if="!timerStore.isRunning && timerStore.timeTrackingId"
                                class="col-span-full flex gap-2">
                                <Button type="submit" class="cursor-pointer" :disabled="timerStore.isRunning">
                                    Save
                                </Button>
                            </div>
                        </div>
                    </DialogFooter>
                </div>
            </form>

        </DialogContent>
    </Dialog>
</template>
