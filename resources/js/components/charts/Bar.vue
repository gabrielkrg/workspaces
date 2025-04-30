<script setup lang="ts">
import HeadingSmall from '@/components/HeadingSmall.vue';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { Bar } from 'vue-chartjs';

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
        default: () => ({
            labels: [1, 2, 3, 4, 5, 6],
            datasets: [
                {
                    label: 'My First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 205, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(201, 203, 207, 0.2)',
                    ],
                    borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)',
                        'rgb(201, 203, 207)',
                    ],
                    borderWidth: 1,
                },
            ],
        }),
    },
    chartOptions: {
        type: Object as () => Record<string, any>,
        default: () => ({
            responsive: true,
            // maintainAspectRatio: false,
            indexAxis: 'y',
        }),
    },
});

// Register the necessary components from Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
</script>

<template>
    <div class="flex flex-col text-center">
        <HeadingSmall :title="title" :description="description" class="mb-5" />
        <div class="border-sidebar-border/70 dark:border-sidebar-border relative flex rounded-xl border p-5">
            <Bar :data="chartData" :options="chartOptions" />
        </div>
    </div>
</template>
