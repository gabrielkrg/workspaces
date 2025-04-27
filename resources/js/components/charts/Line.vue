<script setup lang="ts">
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { defineProps } from 'vue';
import { Line } from 'vue-chartjs';

// Register the necessary components from Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Define props with TypeScript types
const props = defineProps({
    chartData: {
        type: Object as () => Record<string, any>,
        default: () => ({
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
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
    <Line :data="chartData" :options="chartOptions" class="p-5" />
</template>
