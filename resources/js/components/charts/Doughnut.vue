<script setup lang="ts">
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { defineProps } from 'vue';
import { Doughnut } from 'vue-chartjs';

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Define props with TypeScript types
const props = defineProps({
    chartData: {
        type: Object as () => Record<string, any>,
        default: () => ({
            labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
            datasets: [
                {
                    // backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                    backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
                    data: [40, 20, 80, 10],
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
    <Doughnut :data="chartData" :options="chartOptions" class="p-5" />
</template>
