<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import VueApexCharts from 'vue3-apexcharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Clock, TrendingUp, CalendarIcon } from 'lucide-vue-next'

const types = [
    { label: 'Task', model: 'App\\Models\\Task' },
    { label: 'Card', model: 'App\\Models\\Card' },
    { label: 'Ticket', model: 'App\\Models\\Ticket' },
]


const loading = ref(false)
const trackableType = ref<string[]>(
    types.map(type => type.model)
)
const selectedRange = ref(7)
const startDate = ref('')
const endDate = ref('')
const isSelectingEnd = ref(false)
const calendarOpen = ref(false)

const stats = ref<{
    types: { label: string; data: number[] }[],
    days: string[]
} | null>(null)

// Helper to get computed CSS color value
const getCssColor = (varName: string): string => {
    if (typeof window === 'undefined') return ''
    const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
    return value ? `oklch(${value.replace('oklch(', '').replace(')', '')})` : ''
}

// Reactive colors that update with theme
const colors = ref({
    chart1: '',
    chart2: '',
    chart3: '',
    foreground: '',
    mutedForeground: '',
    border: '',
})

const isDarkTheme = ref(false)

const updateColors = () => {
    isDarkTheme.value = document.documentElement.classList.contains('dark')
    colors.value = {
        chart1: getCssColor('--chart-1') || '#22c55e',
        chart2: getCssColor('--chart-2') || '#3b82f6',
        chart3: getCssColor('--chart-3') || '#f97316',
        foreground: getCssColor('--foreground') || (isDarkTheme.value ? '#ffffff' : '#000000'),
        mutedForeground: getCssColor('--muted-foreground') || '#888888',
        border: getCssColor('--border') || '#333333',
    }
}

const categories = computed(() => {
    const types = stats.value?.types
    if (!types) return []

    const firstType = Object.values(types)[0] as any
    if (!firstType?.data) return []

    return Object.keys(firstType.data)
})

function formatDayLabel(date: string): string {
    const d = new Date(date + 'T00:00:00') // avoid timezone shift
    return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
    })
}

const areaChartOptions = computed(() => ({
    chart: {
        type: 'area' as const,
        toolbar: { show: false },
        background: 'transparent',
        stacked: true,
    },
    colors: [colors.value.chart1, colors.value.chart2, colors.value.chart3],
    stroke: {
        curve: 'smooth' as const,
        width: 2,
    },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.5,
            opacityTo: 0.1,
        },
    },
    dataLabels: { enabled: false },
    xaxis: {
        categories: categories.value.map(formatDayLabel),
        labels: {
            style: { colors: colors.value.mutedForeground },
            rotate: -45,
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
    },
    yaxis: {
        labels: {
            style: { colors: colors.value.mutedForeground },
            formatter: (val: number) => val.toFixed(1) + 'h',
        },
    },
    tooltip: {
        theme: isDarkTheme.value ? 'dark' : 'light',
        y: { formatter: (val: number) => `${val.toFixed(2)} hours` },
    },
    grid: {
        borderColor: colors.value.border,
        strokeDashArray: 4,
    },
    legend: {
        position: 'top' as const,
        horizontalAlign: 'right' as const,
        labels: { colors: colors.value.foreground },
        show: false,
    },
}))

const areaChartSeries = computed(() => {
    const result: { name: string; data: number[] }[] = []

    const types = stats.value?.types
    if (!types) return result

    const keys = categories.value

    Object.values(types).forEach((type: any) => {
        result.push({
            name: type.label,
            data: keys.map((day) => {
                // seconds → hours
                return (type.data[day] ?? 0) / 3600
            }),
        })
    })

    return result
})

// Format date range for display
const formattedDateRange = computed(() => {
    if (!startDate.value) return 'Select dates'

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr + 'T00:00:00')
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    if (startDate.value === endDate.value) {
        return formatDate(startDate.value)
    }

    return `${formatDate(startDate.value)} - ${formatDate(endDate.value)}`
})

const fetchStats = async () => {
    loading.value = true
    try {
        const params: Record<string, string | string[]> = {}

        if (startDate.value) params.start_date = startDate.value
        if (endDate.value) params.end_date = endDate.value
        if (trackableType.value.length > 0) params.trackable_type = trackableType.value

        const response = await axios.get(route('api.time-tracking.stats'), { params })
        stats.value = response.data
    } catch (error) {
        console.error('Error fetching stats:', error)
    } finally {
        loading.value = false
    }
}

const setDateRange = (days: number) => {
    selectedRange.value = days
    const today = new Date()
    const start = new Date()
    start.setDate(start.getDate() - days)
    startDate.value = start.toISOString().split('T')[0]
    endDate.value = today.toISOString().split('T')[0]
    fetchStats()
}

// Handle calendar selection
const onCalendarSelect = (value: any) => {
    if (!value) return

    const dateStr = `${value.year}-${String(value.month).padStart(2, '0')}-${String(value.day).padStart(2, '0')}`

    if (!isSelectingEnd.value) {
        // Selecting start date
        startDate.value = dateStr
        endDate.value = dateStr
        isSelectingEnd.value = true
    } else {
        // Selecting end date
        if (dateStr < startDate.value) {
            // If selected date is before start, make it the new start
            endDate.value = startDate.value
            startDate.value = dateStr
        } else {
            endDate.value = dateStr
        }
        isSelectingEnd.value = false
        selectedRange.value = 0
        calendarOpen.value = false
        fetchStats()
    }
}

const calendarHint = computed(() => {
    return isSelectingEnd.value ? 'Select end date' : 'Select start date'
})

onMounted(() => {
    updateColors()
    setDateRange(7)

    const observer = new MutationObserver(() => {
        updateColors()
    })
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
    })
})

watch(trackableType, () => {
    fetchStats()
})
</script>

<template>
    <div class="grid gap-4 lg:grid-cols-3">
        <!-- Main Chart Card -->
        <Card class="lg:col-span-2">
            <CardHeader class="pb-2">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <CardTitle>Time Tracking Activity</CardTitle>
                        <CardDescription>
                            {{ selectedRange === 0 ? 'Custom date range' : `Showing time tracked for the last
                            ${selectedRange} days` }}
                        </CardDescription>
                    </div>

                    <!-- Filters -->
                    <div class="flex flex-wrap items-center gap-2">
                        <div class="flex items-center justify-end gap-1">
                            <Button @click="setDateRange(7)" :variant="selectedRange === 7 ? 'default' : 'ghost'"
                                size="sm" class="h-7 text-xs px-2">
                                7d
                            </Button>
                            <Button @click="setDateRange(30)" :variant="selectedRange === 30 ? 'default' : 'ghost'"
                                size="sm" class="h-7 text-xs px-2">
                                30d
                            </Button>
                        </div>

                        <Popover v-model:open="calendarOpen">
                            <PopoverTrigger as-child>
                                <Button variant="outline" size="sm" class="h-8 text-xs gap-1.5">
                                    <CalendarIcon class="size-3.5" />
                                    {{ formattedDateRange }}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent class="w-auto p-0" align="end">
                                <div class="p-3 border-b">
                                    <p class="text-sm font-medium">{{ calendarHint }}</p>
                                    <p class="text-xs text-muted-foreground">
                                        {{ startDate && isSelectingEnd ? `From: ${formattedDateRange.split(' - ')[0]}`
                                            : 'Click to select date range' }}
                                    </p>
                                </div>
                                <Calendar @update:model-value="onCalendarSelect" />
                            </PopoverContent>
                        </Popover>


                    </div>


                </div>
            </CardHeader>

            <CardContent class="pt-0">
                <div class="flex items-center  justify-end gap-2 mb-4">
                    <Select multiple v-model="trackableType">
                        <SelectTrigger class="w-[180px]">
                            <SelectValue placeholder="Select types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <div v-for="type in types" :key="type.model">
                                    <SelectItem :value="type.model">
                                        {{ type.label }}
                                    </SelectItem>
                                </div>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <VueApexCharts v-if="stats" type="area" height="280" :options="areaChartOptions"
                    :series="areaChartSeries" />
                <div v-else class="h-[280px] flex items-center justify-center text-muted-foreground">
                    Loading...
                </div>
            </CardContent>
        </Card>

        <!-- Stats Cards Column -->
        <div class="space-y-4">
            <!-- Total Hours Card -->
            <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">Total Hours</CardTitle>
                    <Clock class="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div class="flex items-baseline gap-2">
                        <span class="text-2xl font-bold">123 h</span>
                        <!-- <span v-if="Number(percentageChange) !== 0" class="text-xs flex items-center gap-0.5"
                            :class="Number(percentageChange) >= 0 ? 'text-green-500' : 'text-red-500'">
                            <TrendingUp v-if="Number(percentageChange) >= 0" class="size-3" />
                            {{ percentageChange }}%
                        </span> -->
                    </div>
                    <p class="text-xs text-muted-foreground">
                        <!-- {{ stats?.start_date }} - {{ stats?.end_date }} -->
                    </p>
                </CardContent>
            </Card>

            <!-- Daily Average Card -->
            <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">Daily Average</CardTitle>
                    <Clock class="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold">123 h</div>
                    <p class="text-xs text-muted-foreground">Per day in period</p>
                </CardContent>
            </Card>

            <!-- Active Days Card -->
            <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">Active Days</CardTitle>
                    <Clock class="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold">123</div>
                    <p class="text-xs text-muted-foreground">Days with tracked time</p>
                </CardContent>
            </Card>
        </div>
    </div>
</template>
