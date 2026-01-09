<script setup lang="ts">
import { ref, watch } from 'vue'
import { useForm } from '@inertiajs/vue3'
import { type TimeTracking, type Trackable } from '@/types'
import axios from 'axios'

// UI Components
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { DateTimePicker } from '@/components/ui/date-time-picker'

const props = defineProps<{
    open: boolean
    timeTracking: TimeTracking | null
    types: { label: string; model: string }[]
}>()

const emit = defineEmits<{
    'update:open': [value: boolean]
    'success': []
}>()

const trackables = ref<Trackable[]>([])

const form = useForm({
    start_time: '',
    end_time: '',
    trackable_id: null as number | null,
    trackable_type: '',
    is_running: false as boolean,
})

// Load trackables when type changes
watch(() => form.trackable_type, async (newType) => {
    if (!newType) {
        trackables.value = []
        return
    }

    try {
        const response = await axios.get(route('api.time-tracking.trackables'), {
            params: { trackable_type: newType },
        })
        trackables.value = response.data
    } catch (error) {
        console.error('Error loading trackables:', error)
    }
})

// Populate form when timeTracking changes
watch(() => props.timeTracking, async (timeTracking) => {
    if (!timeTracking) return

    form.trackable_type = timeTracking.trackable_type
    form.trackable_id = timeTracking.trackable_id
    form.start_time = timeTracking.start_time_local || ''
    form.end_time = timeTracking.end_time_local || ''
    form.is_running = timeTracking.is_running

    // Load trackables for the current type
    if (timeTracking.trackable_type) {
        try {
            const response = await axios.get(route('api.time-tracking.trackables'), {
                params: { trackable_type: timeTracking.trackable_type },
            })
            trackables.value = response.data
        } catch (error) {
            console.error('Error loading trackables:', error)
        }
    }
}, { immediate: true })

const submit = () => {
    if (!props.timeTracking) return

    form.put(route('time-tracking.update', props.timeTracking.id), {
        onSuccess: () => {
            emit('update:open', false)
            emit('success')
        },
    })
}

const close = () => {
    emit('update:open', false)
}
</script>

<template>
    <Sheet :open="open" @update:open="$emit('update:open', $event)">
        <SheetContent side="right" class="sm:max-w-[500px]">
            <SheetHeader>
                <SheetTitle>Edit Time Tracking</SheetTitle>
                <SheetDescription>Update time tracking details</SheetDescription>
            </SheetHeader>

            <form v-if="timeTracking" @submit.prevent="submit" class="space-y-4 mt-4 p-4">
                <div class="grid gap-4">
                    <!-- Type Select -->
                    <div class="flex flex-col gap-2">
                        <Label for="edit-trackable-type">Type</Label>
                        <Select v-model="form.trackable_type">
                            <SelectTrigger id="edit-trackable-type" class="w-full">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem v-for="type in types" :key="type.label" :value="type.model">
                                    {{ type.label }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <span class="text-sm text-red-500" v-if="form.errors.trackable_type">
                            {{ form.errors.trackable_type }}
                        </span>
                    </div>

                    <!-- Item Select -->
                    <div class="flex flex-col gap-2" v-if="form.trackable_type">
                        <Label for="edit-trackable-id">Item</Label>
                        <Select v-model="form.trackable_id" :disabled="!form.trackable_type">
                            <SelectTrigger id="edit-trackable-id" class="w-full">
                                <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem v-for="trackable in trackables" :key="trackable.id" :value="trackable.id">
                                    {{ trackable.title }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <span class="text-sm text-red-500" v-if="form.errors.trackable_id">
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

                <div class="flex justify-end gap-2 pt-4">
                    <Button variant="outline" type="button" @click="close">
                        Cancel
                    </Button>
                    <Button type="submit" :disabled="form.processing">
                        Save Changes
                    </Button>
                </div>
            </form>
        </SheetContent>
    </Sheet>
</template>
