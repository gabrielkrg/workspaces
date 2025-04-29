<script setup lang="ts">
import Bar from '@/components/charts/Bar.vue';
import Doughnut from '@/components/charts/Doughnut.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';

const props = defineProps({
    user: {
        type: Object,
    },
    workspaces: {
        type: Array,
    },
});

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const workspacesData = {
    labels: props.workspaces?.map((workspace) => workspace.name),
    datasets: [
        {
            backgroundColor: [
                'rgb(54, 162, 235, .8)',
                'rgb(255, 205, 86, .8)',
                'rgb(75, 192, 192, .8)',
                'rgb(153, 102, 255, .8)',
                'rgb(255, 159, 64, .8)',
                'rgb(255, 99, 132, .8)',
            ],
            borderColor: [
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(153, 102, 255)',
                'rgb(255, 159, 64)',
                'rgb(255, 99, 132)',
            ],
            borderWidth: 1,
            data: props.workspaces?.map((workspace) => workspace.tasks_count),
        },
    ],
};

const workspacesBarData = {
    labels: props.workspaces?.map((workspace) => workspace.name),
    datasets: [
        {
            label: 'Workspaces',
            data: props.workspaces?.map((workspace) => workspace.tasks_count),
            backgroundColor: [
                'rgb(54, 162, 235, .8)',
                'rgb(255, 205, 86, .8)',
                'rgb(75, 192, 192, .8)',
                'rgb(153, 102, 255, .8)',
                'rgb(255, 159, 64, .8)',
                'rgb(255, 99, 132, .8)',
            ],
            borderColor: [
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(153, 102, 255)',
                'rgb(255, 159, 64)',
                'rgb(255, 99, 132)',
            ],
            borderWidth: 1,
        },
    ],
};

const workspcesLineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'Workspaces',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
        },
    ],
};
</script>

<template>
    <Head title="Dashboard" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex-col gap-4 rounded-xl p-4">
            <div class="grid auto-rows-min gap-4 md:grid-cols-3">
                <div class="border-sidebar-border/70 dark:border-sidebar-border relative rounded-xl border">
                    <Bar
                        :title="'Workspaces tasks'"
                        :description="'Here you have to total number of tasks per workspace'"
                        :chartData="workspacesBarData"
                    />
                </div>
                <div class="border-sidebar-border/70 dark:border-sidebar-border relative rounded-xl border">
                    <Doughnut
                        :chartData="workspacesData"
                        :title="'Workspaces tasks'"
                        :description="'Here you have to total number of tasks per workspace'"
                    />
                </div>
                <!-- <div class="border-sidebar-border/70 dark:border-sidebar-border relative rounded-xl border">
                    <Line
                        :title="'Workspaces tasks'"
                        :description="'Here you have to total number of tasks per workspace'"
                        :chartData="workspcesLineData"
                    />
                </div>
                <div class="border-sidebar-border/70 dark:border-sidebar-border relative rounded-xl border">
                    <Radar :title="'Workspaces tasks'" :description="'Here you have to total number of tasks per workspace'" />
                </div> -->
            </div>
        </div>
    </AppLayout>
</template>
