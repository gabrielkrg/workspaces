import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'timer_store'

interface TimerState {
    isRunning: boolean
    timeTrackingId: number | null
    startTime: string | null
}

export const useTimerStore = defineStore('timer', () => {
    // State
    const isRunning = ref(false)
    const timeTrackingId = ref<number | null>(null)
    const startTime = ref<string | null>(null)
    const elapsedTime = ref(0)
    const intervalId = ref<number | null>(null)
    const isInitializing = ref(true)

    // Load from localStorage on init
    const loadFromStorage = () => {
        if (typeof window === 'undefined') return

        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            try {
                const state: TimerState = JSON.parse(stored)
                isRunning.value = state.isRunning || false
                timeTrackingId.value = state.timeTrackingId || null
                startTime.value = state.startTime || null

                // Se estava rodando, calcular elapsed time e iniciar o display
                if (state.isRunning && state.startTime) {
                    updateElapsedTime()
                    startDisplayInterval()
                }
            } catch (e) {
                console.error('Error loading timer from storage:', e)
            }
        }
    }

    // Save to localStorage
    const saveToStorage = () => {
        if (typeof window === 'undefined') return

        const state: TimerState = {
            isRunning: isRunning.value,
            timeTrackingId: timeTrackingId.value,
            startTime: startTime.value
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }

    // Watch para salvar mudanças
    watch([isRunning, timeTrackingId, startTime], () => {
        if (isInitializing.value) return
        saveToStorage()
    })

    // Calcula o tempo decorrido baseado no startTime do servidor
    const updateElapsedTime = () => {
        if (!startTime.value) {
            elapsedTime.value = 0
            return
        }

        const start = new Date(startTime.value).getTime()
        const now = Date.now()
        elapsedTime.value = Math.floor((now - start) / 1000)
    }

    // Inicia o intervalo apenas para atualizar o display
    const startDisplayInterval = () => {
        if (intervalId.value !== null) return

        updateElapsedTime()
        intervalId.value = setInterval(() => {
            updateElapsedTime()
        }, 1000) as unknown as number
    }

    // Para o intervalo de display
    const stopDisplayInterval = () => {
        if (intervalId.value !== null) {
            clearInterval(intervalId.value)
            intervalId.value = null
        }
    }

    // Computed
    const formattedTime = computed(() => {
        const hours = Math.floor(elapsedTime.value / 3600)
        const minutes = Math.floor((elapsedTime.value % 3600) / 60)
        const seconds = elapsedTime.value % 60

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    })

    // Actions
    const setTimerData = (data: { id: number, start_time: string, is_running: boolean, elapsed_time?: number }) => {
        timeTrackingId.value = data.id
        startTime.value = data.start_time
        isRunning.value = data.is_running

        if (data.elapsed_time !== undefined) {
            elapsedTime.value = data.elapsed_time
        } else {
            updateElapsedTime()
        }

        if (data.is_running) {
            startDisplayInterval()
        } else {
            stopDisplayInterval()
        }
    }

    const startTimer = () => {
        isRunning.value = true
        startDisplayInterval()
    }

    const pauseTimer = () => {
        isRunning.value = false
        stopDisplayInterval()
    }

    const resetTimer = () => {
        stopDisplayInterval()
        isRunning.value = false
        timeTrackingId.value = null
        startTime.value = null
        elapsedTime.value = 0
        localStorage.removeItem(STORAGE_KEY)
    }

    const setTimeTrackingId = (id: number | null) => {
        timeTrackingId.value = id
    }

    // Cleanup
    const cleanup = () => {
        stopDisplayInterval()
    }

    // Initialize on store creation
    loadFromStorage()
    isInitializing.value = false

    return {
        // State
        isRunning,
        elapsedTime,
        timeTrackingId,
        startTime,

        // Computed
        formattedTime,

        // Actions
        setTimerData,
        startTimer,
        pauseTimer,
        resetTimer,
        setTimeTrackingId,
        cleanup
    }
})
