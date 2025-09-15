<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import { columns } from './components/columns'
import DataTable from './components/DataTable.vue'
import tasks from './data/tasks.json'
import CreateRoster from './components/CreateRoster.vue'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lists',
        href: '/lists',
    },
];

const createRoster = () => {
    console.log('createRoster');
}

</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">

        <Head title="Dashboard" />
        <div class="h-full flex-1 flex-col space-y-8 p-8 flex">
            <div class="flex items-center justify-between space-y-2">
                <div>
                    <h2 class="text-2xl font-bold tracking-tight">
                        Welcome back!
                    </h2>
                    <p class="text-muted-foreground">
                        Here's a list of your tasks for this month!
                    </p>
                </div>
                <div class="flex items-center space-x-2">
                    <CreateRoster />
                </div>
            </div>
            <DataTable :data="tasks" :columns="columns" />
        </div>
    </AppLayout>
</template>
