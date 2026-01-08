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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
    try {
        // Sempre busca do banco de dados para sincronizar entre dispositivos
        const response = await axios.get(route('api.time-tracking.active'))
        const timeTracking = response.data

        console.log(timeTracking)

        if (timeTracking) {
            timeTrackingId.value = timeTracking.id

            // Atualiza o store com os dados do servidor
            timerStore.setTimerData({
                id: timeTracking.id,
                start_time: timeTracking.start_time,
                is_running: timeTracking.is_running,
                elapsed_time: timeTracking.elapsed_time
            })

            // Primeiro define o tipo para carregar os trackables
            if (timeTracking.trackable_type) {
                trackableType.value = timeTracking.trackable_type
                form.trackable_type = timeTracking.trackable_type
                await loadTrackables(timeTracking.trackable_type)
            }

            // Usa os campos já formatados pelo servidor no timezone do workspace
            form.start_time = timeTracking.start_time_local || ''
            form.end_time = timeTracking.end_time_local || ''
            form.trackable_id = timeTracking.trackable_id || ''
        } else {
            timerStore.resetTimer()
        }
    } catch (error) {
        console.error('Error loading active time tracking:', error)
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
        }
    })
}

const start = async () => {
    try {
        const response = await axios.post(route('api.time-tracking.start'), {
            trackable_id: form.trackable_id,
            trackable_type: form.trackable_type,
        })

        const timeTracking = response.data
        timeTrackingId.value = timeTracking.id

        // Atualiza o store com os dados do servidor
        timerStore.setTimerData({
            id: timeTracking.id,
            start_time: timeTracking.start_time,
            is_running: timeTracking.is_running,
            elapsed_time: timeTracking.elapsed_time || 0
        })

        // Primeiro define o tipo para carregar os trackables
        if (timeTracking.trackable_type) {
            trackableType.value = timeTracking.trackable_type
            form.trackable_type = timeTracking.trackable_type
            await loadTrackables(timeTracking.trackable_type)
        }

        // Preenche o formulário com os dados retornados (já formatados pelo servidor)
        form.start_time = timeTracking.start_time_local || ''
        form.end_time = timeTracking.end_time_local || ''
        form.trackable_id = timeTracking.trackable_id || ''
    } catch (error) {
        console.error('Error starting time tracking:', error)
    }
}

const toggleTimer = async () => {
    if (!timeTrackingId.value) return

    try {
        if (timerStore.isRunning) {
            // Pause: chama API para registrar end_time
            const response = await axios.post(route('api.time-tracking.pause', timeTrackingId.value))
            const timeTracking = response.data

            timerStore.setTimerData({
                id: timeTracking.id,
                start_time: timeTracking.start_time,
                is_running: timeTracking.is_running,
                elapsed_time: timeTracking.elapsed_time
            })

            form.end_time = timeTracking.end_time_local || ''
        } else {
            // Resume: chama API que ajusta start_time e limpa end_time
            const response = await axios.post(route('api.time-tracking.resume', timeTrackingId.value))
            const timeTracking = response.data

            timerStore.setTimerData({
                id: timeTracking.id,
                start_time: timeTracking.start_time,
                is_running: timeTracking.is_running,
                elapsed_time: timeTracking.elapsed_time
            })

            // Atualiza start_time no form pois o backend ajusta ele ao resumir
            form.start_time = timeTracking.start_time_local || ''
            form.end_time = ''
        }
    } catch (error) {
        console.error('Error toggling timer:', error)
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

</script>

<template>
    <Dialog v-model="isDialogOpen">
        <DialogTrigger as-child>
            <Button variant="outline" class="gap-2">
                <Timer class="size-5" />
                <span v-if="timerStore.timeTrackingId" class="font-mono text-sm"
                    :class="{ 'text-green-500': timerStore.isRunning }">
                    {{ timerStore.formattedTime }}
                </span>
            </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[400px]">
            <DialogHeader>
                <DialogTitle class="flex items-center gap-2">
                    <Timer class="size-5" />
                    Time Tracker
                </DialogTitle>
                <DialogDescription>
                    Track time spent on your tasks
                </DialogDescription>
            </DialogHeader>

            <form @submit.prevent="submit">
                <div class="flex flex-col gap-6">
                    <!-- Timer Display -->
                    <div v-if="timerStore.timeTrackingId" class="text-center py-6">
                        <p class="text-5xl font-mono font-bold tabular-nums"
                            :class="timerStore.isRunning ? 'text-green-500' : 'text-muted-foreground'">
                            {{ timerStore.formattedTime }}
                        </p>
                        <span class="text-sm text-muted-foreground mt-2 block">
                            {{ timerStore.isRunning ? 'Running' : 'Paused' }}
                        </span>
                    </div>

                    <!-- Timer Controls -->
                    <div v-if="timerStore.timeTrackingId" class="flex justify-center gap-3">
                        <Button type="button" @click="toggleTimer" class="min-w-[120px]">
                            <Play v-if="!timerStore.isRunning" class="size-4 mr-2" />
                            <Pause v-else class="size-4 mr-2" />
                            {{ timerStore.isRunning ? 'Pause' : 'Resume' }}
                        </Button>

                        <AlertDialog>
                            <AlertDialogTrigger as-child>
                                <Button type="button" variant="outline">
                                    <RotateCcw class="size-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Reset Timer</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will delete the current time tracking entry. This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction @click="reset()">Reset</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    <!-- Form Fields -->
                    <div class="flex flex-col gap-4">
                        <div class="flex flex-col gap-2">
                            <Label for="type">Type</Label>
                            <Select v-model="trackableType">
                                <SelectTrigger id="type" class="w-full">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem v-for="type in types" :key="type.label" :value="type.model">
                                        {{ type.label }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <span class="text-xs text-red-500" v-if="form.errors.trackable_type">
                                {{ form.errors.trackable_type }}
                            </span>
                        </div>

                        <div class="flex flex-col gap-2" v-if="trackableType">
                            <Label for="trackable_id">Item</Label>
                            <Select v-model="form.trackable_id" :disabled="!trackableType">
                                <SelectTrigger id="trackable_id" class="w-full">
                                    <SelectValue placeholder="Select item" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem v-for="trackable in trackables" :key="trackable.id"
                                        :value="trackable.id">
                                        {{ trackable.title }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <span class="text-xs text-red-500" v-if="form.errors.trackable_id">
                                {{ form.errors.trackable_id }}
                            </span>
                        </div>
                    </div>

                    <!-- Time Fields -->
                    <div v-if="timerStore.timeTrackingId && !timerStore.isRunning"
                        class="flex flex-col gap-4 pt-4 border-t">
                        <p class="text-xs text-muted-foreground">Adjust times if needed</p>

                        <div class="flex flex-col gap-2">
                            <Label for="start_time">Start Time</Label>
                            <Input id="start_time" v-model="form.start_time" type="datetime-local" class="w-full" />
                            <span class="text-xs text-red-500" v-if="form.errors.start_time">
                                {{ form.errors.start_time }}
                            </span>
                        </div>

                        <div class="flex flex-col gap-2">
                            <Label for="end_time">End Time</Label>
                            <Input id="end_time" v-model="form.end_time" type="datetime-local" class="w-full" />
                            <span class="text-xs text-red-500" v-if="form.errors.end_time">
                                {{ form.errors.end_time }}
                            </span>
                        </div>
                    </div>

                    <!-- Footer Actions -->
                    <DialogFooter class="flex-col gap-2 sm:flex-col">
                        <Button v-if="!timerStore.timeTrackingId" type="button" @click="start()" class="w-full"
                            :disabled="!trackableType || !form.trackable_id">
                            <Play class="size-4 mr-2" />
                            Start Timer
                        </Button>

                        <Button v-if="!timerStore.isRunning && timerStore.timeTrackingId" type="submit" class="w-full">
                            Save Entry
                        </Button>
                    </DialogFooter>
                </div>
            </form>

        </DialogContent>
    </Dialog>
</template>
