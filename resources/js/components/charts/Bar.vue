<script setup lang="ts">
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { Bar } from 'vue-chartjs';

const props = defineProps({
    chartData: {
        type: Object as () => Record<string, any>,
        default: () => ({
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
                {
                    label: 'Data One',
                    backgroundColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(201, 203, 207, 1)',
                    ],
                    data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11],
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

// Register the necessary components from Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
</script>

<template>
    <Bar :data="chartData" :options="chartOptions" class="p-5" />
</template>
