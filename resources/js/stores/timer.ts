import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Trackable {
    id: number
    title: string
}

export const useTimerStore = defineStore('timer', () => {
    // State
    const isRunning = ref(false)
    const elapsedTime = ref(0)
    const startTime = ref<string | null>(null)
    const endTime = ref<string | null>(null)
    const trackableType = ref('')
    const trackableId = ref<string | number>('')
    const trackable = ref<Trackable | null>(null)
    const intervalId = ref<number | null>(null)

    // Computed
    const formattedTime = computed(() => {
        const hours = Math.floor(elapsedTime.value / 3600)
        const minutes = Math.floor((elapsedTime.value % 3600) / 60)
        const seconds = elapsedTime.value % 60

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    })

    const hasActiveTimer = computed(() => {
        return isRunning.value || elapsedTime.value > 0
    })

    // Actions
    const startTimer = () => {
        if (!isRunning.value) {
            isRunning.value = true
            if (!startTime.value) {
                startTime.value = new Date().toISOString()
            }
            intervalId.value = setInterval(() => {
                elapsedTime.value++
            }, 1000)
        }
    }

    const pauseTimer = () => {
        if (isRunning.value) {
            isRunning.value = false
            if (intervalId.value) {
                clearInterval(intervalId.value)
                intervalId.value = null
            }
        }
    }

    const toggleTimer = () => {
        if (isRunning.value) {
            pauseTimer()
        } else {
            startTimer()
        }
    }

    const resetTimer = () => {
        pauseTimer()
        elapsedTime.value = 0
        startTime.value = null
        endTime.value = null
        trackableType.value = ''
        trackableId.value = ''
        trackable.value = null
    }

    const setTrackable = (type: string, id: string | number, trackableData?: Trackable) => {
        trackableType.value = type
        trackableId.value = id
        trackable.value = trackableData || null
    }

    const setStartTime = (time: string) => {
        startTime.value = time
    }

    const setEndTime = (time: string) => {
        endTime.value = time
    }

    const stopTimer = () => {
        pauseTimer()
        endTime.value = new Date().toISOString()
    }

    // Cleanup on store destruction
    const cleanup = () => {
        if (intervalId.value) {
            clearInterval(intervalId.value)
            intervalId.value = null
        }
    }

    return {
        // State
        isRunning,
        elapsedTime,
        startTime,
        endTime,
        trackableType,
        trackableId,
        trackable,

        // Computed
        formattedTime,
        hasActiveTimer,

        // Actions
        startTimer,
        pauseTimer,
        toggleTimer,
        resetTimer,
        setTrackable,
        setStartTime,
        setEndTime,
        stopTimer,
        cleanup
    }
}) 