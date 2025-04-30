<script setup lang="ts">
import HeadingSmall from '@/components/HeadingSmall.vue';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { defineProps } from 'vue';
import { Doughnut } from 'vue-chartjs';

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Define props with TypeScript types
const props = defineProps({
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
    <div class="flex flex-col text-center">
        <HeadingSmall :title="title" :description="description" class="mb-5" />
        <div class="border-sidebar-border/70 dark:border-sidebar-border relative flex rounded-xl border p-5">
            <Doughnut :data="chartData" :options="chartOptions" />
        </div>
    </div>
</template>
