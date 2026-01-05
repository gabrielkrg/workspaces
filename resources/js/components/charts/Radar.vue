<script setup lang="ts">
import HeadingSmall from '@/components/HeadingSmall.vue';
import { Chart as ChartJS, Filler, Legend, LineElement, PointElement, RadialLinearScale, Tooltip } from 'chart.js';
import { Radar } from 'vue-chartjs';

// Register the necessary components from Chart.js
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

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
        default: () => ({
            labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
            datasets: [
                {
                    label: 'My First Dataset',
                    data: [65, 59, 90, 81, 56, 55, 40],
                    fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(255, 99, 132)',
                },
                {
                    label: 'My Second Dataset',
                    data: [28, 48, 40, 19, 96, 27, 100],
                    fill: true,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    pointBackgroundColor: 'rgb(54, 162, 235)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(54, 162, 235)',
                },
            ],
        }),
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
            <Radar :data="chartData" :options="chartOptions" />
        </div>
    </div>
</template>
