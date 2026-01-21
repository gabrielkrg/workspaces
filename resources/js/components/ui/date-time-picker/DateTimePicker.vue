<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { CalendarIcon } from 'lucide-vue-next'
import { CalendarDate } from '@internationalized/date'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

const props = defineProps<{
    modelValue: string
    placeholder?: string
    id?: string
}>()

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const localTime = ref('')

// Parse datetime-local format: "2026-01-09T14:30"
const parsedDate = computed(() => {
    if (!props.modelValue) return null
    const [datePart, timePart] = props.modelValue.split('T')
    if (!datePart) return null

    const [year, month, day] = datePart.split('-').map(Number)
    const [hours, minutes] = timePart ? timePart.split(':').map(Number) : [0, 0]

    return { year, month, day, hours, minutes }
})

// Calendar value for reka-ui Calendar component
const calendarValue = computed(() => {
    if (!parsedDate.value) return undefined
    const { year, month, day } = parsedDate.value
    return new CalendarDate(year, month, day)
})

// Initialize localTime when modelValue changes
watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        const [, timePart] = newValue.split('T')
        localTime.value = timePart?.substring(0, 5) || getCurrentTimeString()
    } else {
        localTime.value = getCurrentTimeString()
    }
}, { immediate: true })

// Also set default time when popover opens
watch(isOpen, (open) => {
    if (open && !localTime.value) {
        localTime.value = getCurrentTimeString()
    }
})

const getCurrentTimeString = () => {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

const getCurrentDate = () => {
    const now = new Date()
    return {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate()
    }
}

const formattedDisplay = computed(() => {
    if (!parsedDate.value) return props.placeholder || 'Select date and time'
    const { year, month, day, hours, minutes } = parsedDate.value
    const date = new Date(year, month - 1, day)
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    return `${dateStr} at ${timeStr}`
})

const onCalendarSelect = (value: any) => {
    if (!value) return

    const dateStr = `${value.year}-${String(value.month).padStart(2, '0')}-${String(value.day).padStart(2, '0')}`
    const time = localTime.value || getCurrentTimeString()
    emit('update:modelValue', `${dateStr}T${time}`)
}

const onTimeChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    localTime.value = target.value

    // If date is selected, emit the full value
    if (parsedDate.value) {
        const { year, month, day } = parsedDate.value
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        emit('update:modelValue', `${dateStr}T${target.value}`)
    } else {
        // Use current date
        const current = getCurrentDate()
        const dateStr = `${current.year}-${String(current.month).padStart(2, '0')}-${String(current.day).padStart(2, '0')}`
        emit('update:modelValue', `${dateStr}T${target.value}`)
    }
}
</script>

<template>
    <Popover v-model:open="isOpen">
        <PopoverTrigger as-child>
            <Button :id="id" variant="outline" :class="cn(
                'w-full justify-start text-left font-normal',
                !modelValue && 'text-muted-foreground'
            )">
                <CalendarIcon class="mr-2 h-4 w-4" />
                {{ formattedDisplay }}
            </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0" align="start">
            <Calendar :model-value="calendarValue" @update:model-value="onCalendarSelect" />
            <div class="border-t p-3">
                <Label for="time-picker" class="text-xs text-muted-foreground">Time</Label>
                <Input type="time" v-model="localTime" @change="onTimeChange" />
            </div>
        </PopoverContent>
    </Popover>
</template>
