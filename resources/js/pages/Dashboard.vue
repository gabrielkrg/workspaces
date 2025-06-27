<script setup lang="ts">
import Bar from '@/components/charts/Bar.vue';
import Doughnut from '@/components/charts/Doughnut.vue';
import LatestChanges from '@/components/LatestChanges.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/vue3';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import HeadingSmall from '@/components/HeadingSmall.vue';

const props = defineProps({
    user: {
        type: Object,
    },
    workspace: {
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
            <HeadingSmall title="Overview" description="Here you have to total number of tasks, tickets and clients"
                class="mb-5 text-center" />

            <div class="grid auto-rows-min gap-4 md:grid-cols-3">
                <Link :href="route('tasks.index')">
                <Card class="hover:bg-sidebar-border/70 dark:hover:bg-sidebar-border">
                    <CardHeader>
                        <CardTitle>Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p class="text-2xl font-bold">{{ props.workspace.tasks_count }}</p>
                    </CardContent>
                </Card>
                </Link>

                <Link :href="route('tickets.index')">
                <Card class="hover:bg-sidebar-border/70 dark:hover:bg-sidebar-border">
                    <CardHeader>
                        <CardTitle>Tickets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p class="text-2xl font-bold">{{ props.workspace.tickets_count }}</p>
                    </CardContent>
                </Card>
                </Link>

                <Link :href="route('clients.index')">
                <Card class="hover:bg-sidebar-border/70 dark:hover:bg-sidebar-border">
                    <CardHeader>
                        <CardTitle>Clients</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p class="text-2xl font-bold">{{ props.workspace.clients_count }}</p>
                    </CardContent>
                </Card>
                </Link>

            </div>
        </div>


        <div class="flex-col gap-4 rounded-xl p-4">

            <div class="grid auto-rows-min gap-4 md:grid-cols-3">
                <div>
                    <LatestChanges />
                </div>
                <div>
                    <Bar :title="'Workspaces tasks'"
                        :description="'Here you have to total number of tasks per workspace'"
                        :chartData="workspacesBarData" />
                </div>
                <div>
                    <Doughnut :chartData="workspacesData" :title="'Workspaces tasks'"
                        :description="'Here you have to total number of tasks per workspace'" />
                </div>
                <!-- <div>
                    <Line
                        :title="'Workspaces tasks'"
                        :description="'Here you have to total number of tasks per workspace'"
                        :chartData="workspcesLineData"
                    />
                </div> -->
                <!-- <div>
                    <Radar :title="'Workspaces tasks'" :description="'Here you have to total number of tasks per workspace'" />
                </div> -->
            </div>
        </div>
    </AppLayout>
</template>
