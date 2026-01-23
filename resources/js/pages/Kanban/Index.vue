<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/vue3';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Kanban, Tag } from '@/types';
import HeadingLarge from '@/components/HeadingLarge.vue';
import CreateKanban from '@/components/kanban/CreateKanban.vue';
import KanbanCardActions from '@/components/kanban/KanbanCardActions.vue';

defineProps<{
    kanbans: Kanban[];
    tags: Tag[];
}>();

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kanban',
        href: '/kanban',
    },
];

const navigateToKanban = (kanban: Kanban) => {
    router.get(route('kanban.show', kanban.id));
};

</script>

<template>

    <Head title="Kanbans" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex-1 space-y-6 md:p-8 md:pt-6 p-4 pt-2">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <HeadingLarge title="Kanbans" description="Here's a list of your kanbans!" />
                <CreateKanban />
            </div>

            <!-- Kanbans List -->
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4" v-if="kanbans.length > 0">
                <Card v-for="kanban in kanbans" :key="kanban.id" class="cursor-pointer gap-2"
                    @click="navigateToKanban(kanban)">
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">
                            Kanban
                        </CardTitle>
                        <div class="flex gap-2" @click.stop>
                            <KanbanCardActions :kanban="kanban" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold">
                            {{ kanban.name }}
                        </div>
                        <p class="text-xs text-muted-foreground">
                            {{ kanban.cards_count }} cards
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div v-else class="flex h-32 items-center justify-center rounded-lg border">
                <p class="text-gray-800 dark:text-gray-100">There are no kanbans yet</p>
            </div>
        </div>
    </AppLayout>
</template>
