<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import RecentActivity from '@/components/RecentActivity.vue';
import { Kanban, ListTodo, Ticket, Users } from 'lucide-vue-next';
import { Link } from '@inertiajs/vue3';
import Bar from '@/components/charts/Bar.vue';
import Doughnut from '@/components/charts/Doughnut.vue';



interface Workspace {
    cards_count: number;
    tasks_count: number;
    tickets_count: number;
    clients_count: number;
}


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
        <div class="flex-1 space-y-4 p-8 pt-6">
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Link :href="route('kanban.index')">
                <Card>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">
                            Cards
                        </CardTitle>
                        <Kanban class="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold">
                            {{ workspace.cards_count }}
                        </div>
                    </CardContent>
                </Card>
                </Link>

                <Link :href="route('tasks.index')">
                <Card>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">
                            Tasks
                        </CardTitle>
                        <ListTodo class="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold">
                            {{ workspace.tasks_count }}
                        </div>
                    </CardContent>
                </Card>
                </Link>

                <Link :href="route('tickets.index')">
                <Card>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">
                            Tickets
                        </CardTitle>
                        <Ticket class="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold">
                            {{ workspace.tickets_count }}
                        </div>
                    </CardContent>
                </Card>
                </Link>

                <Link :href="route('clients.index')">
                <Card>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">
                            Clients
                        </CardTitle>
                        <Users class="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold">
                            {{ workspace.clients_count }}
                        </div>
                    </CardContent>
                </Card>
                </Link>
            </div>

            <div class="grid auto-rows-min gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader class="flex flex-col items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">
                            Recent Activity
                        </CardTitle>
                        <CardDescription>
                            Here you have to total number of tasks per workspace
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RecentActivity />
                    </CardContent>
                </Card>

                <Bar :title="'Workspaces tasks'" :description="'Here you have to total number of tasks per workspace'"
                    :chartData="workspacesBarData" />

                <Doughnut :chartData="workspacesData" :title="'Workspaces tasks'"
                    :description="'Here you have to total number of tasks per workspace'" />
            </div>
        </div>

    </AppLayout>
</template>
