<script setup lang="ts">
import Doughnut from '@/components/charts/Doughnut.vue';
import Line from '@/components/charts/Line.vue';
import Radar from '@/components/charts/Radar.vue';
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

const workspacesDataCharts = {
    labels: props.workspaces.map((workspace) => workspace.name),
    datasets: [
        {
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(153, 102, 255)',
                'rgb(255, 159, 64)',
            ],
            data: props.workspaces.map((workspace) => workspace.tasks_count),
        },
    ],
};

const totalTasks = props.user?.workspace.tasks.length;
const concludedTasks = props.user?.workspace.tasks.filter((task) => task.done).length;
const concludedPercentage = totalTasks > 0 ? Math.round((concludedTasks / totalTasks) * 100) : 0;

const currentWorkspaceData = {
    labels: ['Total', 'Concluded'],
    datasets: [
        {
            backgroundColor: ['rgb(197 197 197)', 'rgb(0 166 62)'],
            data: [100, concludedPercentage],
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
                    <Doughnut
                        :chartData="currentWorkspaceData"
                        :title="`${user.workspace.name}`"
                        :description="`Here you have the percentage of the conclusion of the tasks for the workspace`"
                    />
                </div>
                <div class="border-sidebar-border/70 dark:border-sidebar-border relative rounded-xl border">
                    <Doughnut
                        :chartData="workspacesDataCharts"
                        :title="'All Workspaces'"
                        :description="'Here you have to total number of tasks per workspace'"
                    />
                </div>
                <div class="border-sidebar-border/70 dark:border-sidebar-border relative rounded-xl border">
                    <Line />
                </div>
                <!-- <div class="border-sidebar-border/70 dark:border-sidebar-border relative  rounded-xl border">
                    <Bar />
                </div> -->
                <div class="border-sidebar-border/70 dark:border-sidebar-border relative rounded-xl border">
                    <Radar />
                </div>
            </div>
        </div>
    </AppLayout>
</template>
