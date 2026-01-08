import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'timer_store'

interface TimerState {
    isRunning: boolean
    timeTrackingId: number | null
    elapsedTime: number
}

export const useTimerStore = defineStore('timer', () => {
    // State
    const isRunning = ref(false)
    const timeTrackingId = ref<number | null>(null)
    const elapsedTime = ref(0)
    const intervalId = ref<number | null>(null)
    const isInitializing = ref(true)
    const lastUpdateTime = ref<number | null>(null)

    // Load from localStorage on init
    const loadFromStorage = () => {
        if (typeof window === 'undefined') return

        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            try {
                const state: TimerState = JSON.parse(stored)
                isRunning.value = state.isRunning || false
                timeTrackingId.value = state.timeTrackingId || null
                elapsedTime.value = state.elapsedTime || 0

                // Se estava rodando, calcular tempo decorrido desde último save
                if (state.isRunning && lastUpdateTime.value) {
                    const now = Date.now()
                    const timeSinceLastUpdate = Math.floor((now - lastUpdateTime.value) / 1000)
                    elapsedTime.value += timeSinceLastUpdate
                    startDisplayInterval()
                } else if (state.isRunning) {
                    // Se não tem lastUpdateTime mas estava rodando, inicia o intervalo
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

        lastUpdateTime.value = Date.now()
        const state: TimerState = {
            isRunning: isRunning.value,
            timeTrackingId: timeTrackingId.value,
            elapsedTime: elapsedTime.value
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }

    // Watch para salvar mudanças
    watch([isRunning, timeTrackingId], () => {
        if (isInitializing.value) return
        saveToStorage()
    })

    // Salva periodicamente quando está rodando
    let saveInterval: number | null = null
    const startSaveInterval = () => {
        if (saveInterval !== null) return
        saveInterval = setInterval(() => {
            if (isRunning.value) {
                saveToStorage()
            }
        }, 5000) as unknown as number
    }

    const stopSaveInterval = () => {
        if (saveInterval !== null) {
            clearInterval(saveInterval)
            saveInterval = null
        }
    }

    // Inicia o intervalo para incrementar o display
    const startDisplayInterval = () => {
        if (intervalId.value !== null) return

        intervalId.value = setInterval(() => {
            elapsedTime.value++
        }, 1000) as unknown as number

        startSaveInterval()
    }

    // Para o intervalo de display
    const stopDisplayInterval = () => {
        if (intervalId.value !== null) {
            clearInterval(intervalId.value)
            intervalId.value = null
        }
        stopSaveInterval()
    }

    // Computed
    const formattedTime = computed(() => {
        const totalSeconds = Math.abs(elapsedTime.value)
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    })

    // Actions
    const setTimerData = (data: { id: number, start_time: string, is_running: boolean, elapsed_time?: number }) => {
        timeTrackingId.value = data.id
        isRunning.value = data.is_running

        // Usa o elapsed_time do servidor (já calculado corretamente com timezone)
        if (data.elapsed_time !== undefined && data.elapsed_time >= 0) {
            elapsedTime.value = data.elapsed_time
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
        elapsedTime.value = 0
        lastUpdateTime.value = null
        localStorage.removeItem(STORAGE_KEY)

        console.log(isRunning.value, timeTrackingId.value, elapsedTime.value, lastUpdateTime.value, 'resetTimer')
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
