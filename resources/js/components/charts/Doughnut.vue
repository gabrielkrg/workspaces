<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { defineProps } from 'vue';
import { Doughnut } from 'vue-chartjs';

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Define props with TypeScript types
defineProps({
    title: {
        type: String,
        default: 'Title',
    },
    description: {
        type: String,
        default: 'Description',
    },
    chartData: {
        type: Object as () => Record<string, any>,
        required: true,
    },
    chartOptions: {
        type: Object as () => Record<string, any>,
        default: () => ({
            responsive: true,
            maintainAspectRatio: false,
        }),
    },
});
</script>

<template>
    <Card>
        <CardHeader class="flex flex-col items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">
                {{ title }}
            </CardTitle>
            <CardDescription>
                {{ description }}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div>
                <Doughnut :data="chartData" :options="chartOptions" />
            </div>
        </CardContent>
    </Card>
</template>
