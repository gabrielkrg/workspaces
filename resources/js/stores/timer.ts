import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'timer_store'

interface TimerState {
    isRunning: boolean
    elapsedTime: number
    startTimestamp: number | null
    lastSaveTime: number | null
    timeTrackingId: number | null
}

export const useTimerStore = defineStore('timer', () => {
    // State
    const isRunning = ref(false)
    const elapsedTime = ref(0)
    const startTimestamp = ref<number | null>(null)
    const lastSaveTime = ref<number | null>(null)
    const intervalId = ref<number | null>(null)
    const isInitializing = ref(true)
    const timeTrackingId = ref<number | null>(null)

    // Load from localStorage on init
    const loadFromStorage = () => {
        if (typeof window === 'undefined') return

        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            try {
                const state: TimerState = JSON.parse(stored)

                // Se estava rodando, calcular tempo decorrido desde o último save
                if (state.isRunning && state.lastSaveTime) {
                    const now = Date.now()
                    const timeSinceLastSave = Math.floor((now - state.lastSaveTime) / 1000)
                    elapsedTime.value = state.elapsedTime + timeSinceLastSave
                    startTimestamp.value = state.startTimestamp
                    lastSaveTime.value = now
                    timeTrackingId.value = state.timeTrackingId || null
                    isRunning.value = true
                    // Inicia o timer sem criar novo startTimestamp
                    intervalId.value = setInterval(() => {
                        elapsedTime.value++
                    }, 1000) as unknown as number
                    // Inicia o saveInterval também
                    startSaveInterval()
                } else {
                    elapsedTime.value = state.elapsedTime || 0
                    isRunning.value = state.isRunning || false
                    startTimestamp.value = state.startTimestamp
                    lastSaveTime.value = state.lastSaveTime
                    timeTrackingId.value = state.timeTrackingId || null
                }
            } catch (e) {
                console.error('Error loading timer from storage:', e)
            }
        }
    }

    // Save to localStorage
    const saveToStorage = () => {
        if (typeof window === 'undefined') return

        lastSaveTime.value = Date.now()
        const state: TimerState = {
            isRunning: isRunning.value,
            elapsedTime: elapsedTime.value,
            startTimestamp: startTimestamp.value,
            lastSaveTime: lastSaveTime.value,
            timeTrackingId: timeTrackingId.value
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }

    // Salva periodicamente quando está rodando (a cada 5 segundos)
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

    // Watch apenas para isRunning, startTimestamp e timeTrackingId (não elapsedTime)
    watch([isRunning, startTimestamp, timeTrackingId], () => {
        if (isInitializing.value) return
        saveToStorage()
        if (isRunning.value) {
            startSaveInterval()
        } else {
            stopSaveInterval()
        }
    })

    // Computed
    const formattedTime = computed(() => {
        const hours = Math.floor(elapsedTime.value / 3600)
        const minutes = Math.floor((elapsedTime.value % 3600) / 60)
        const seconds = elapsedTime.value % 60

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    })

    // Actions
    const startTimer = () => {
        if (!isRunning.value) {
            isRunning.value = true
            // Se não tem startTimestamp, é um novo start - cria timestamp
            // Se tem startTimestamp, está retomando após refresh - mantém o original
            if (!startTimestamp.value) {
                startTimestamp.value = Date.now()
            }
            intervalId.value = setInterval(() => {
                elapsedTime.value++
            }, 1000) as unknown as number
        }
    }

    const pauseTimer = () => {
        if (isRunning.value) {
            isRunning.value = false
            if (intervalId.value !== null) {
                clearInterval(intervalId.value)
                intervalId.value = null
            }
            // Mantém o startTimestamp para poder retomar depois
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
        stopSaveInterval()
        elapsedTime.value = 0
        startTimestamp.value = null
        lastSaveTime.value = null
        timeTrackingId.value = null
        localStorage.removeItem(STORAGE_KEY)
    }

    const setTimeTrackingId = (id: number | null) => {
        timeTrackingId.value = id
    }

    // Cleanup
    const cleanup = () => {
        if (intervalId.value !== null) {
            clearInterval(intervalId.value)
            intervalId.value = null
        }
        stopSaveInterval()
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
        startTimer,
        pauseTimer,
        toggleTimer,
        resetTimer,
        setTimeTrackingId,
        cleanup
    }
}) 