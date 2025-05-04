<script setup lang="ts">

import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import KanbanBoard from '@/components/kanban/KanbanBoard.vue';


const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Kanban',
    href: '/kanban',
  },
];

const props = defineProps({
  kanban: Object,
});

</script>

<template>

  <Head title="Kanbans" />

  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
      <KanbanBoard :kanban="kanban" />
    </div>
  </AppLayout>
</template>
