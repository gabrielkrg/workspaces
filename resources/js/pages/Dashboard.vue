<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import HeadingLarge from '@/components/HeadingLarge.vue';
import { Kanban, ListTodo, Ticket, Users } from 'lucide-vue-next';
import DashboardStatCard from '@/components/DashboardStatCard.vue';
import TimeTrackingChart from '@/components/TimeTrackingChart.vue';

defineProps({
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

</script>

<template>

    <Head title="Dashboard" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex-1 space-y-6 md:p-8 md:pt-6 p-4 pt-2">
            <div>
                <HeadingLarge title="Dashboard" description="Here's a overview of your workspace!" />
            </div>
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DashboardStatCard :href="route('kanban.index')" title="Cards" :value="workspace.cards_count"
                    :icon="Kanban" />

                <DashboardStatCard :href="route('tasks.index')" title="Tasks" :value="workspace.tasks_count"
                    :icon="ListTodo" />

                <DashboardStatCard :href="route('tickets.index')" title="Tickets" :value="workspace.tickets_count"
                    :icon="Ticket" />

                <DashboardStatCard :href="route('clients.index')" title="Clients" :value="workspace.clients_count"
                    :icon="Users" />
            </div>

            <!-- Time Tracking Chart -->
            <TimeTrackingChart />
        </div>

    </AppLayout>
</template>
