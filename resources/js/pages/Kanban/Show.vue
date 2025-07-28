<script setup lang="ts">
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/AppLayout.vue';
import { Head } from '@inertiajs/vue3';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import KanbanColumn from '@/components/kanban/KanbanColumn.vue';
import EditCard from '@/components/kanban/EditCard.vue';
import EditKanban from '@/components/kanban/EditKanban.vue';
import GenerateWithAi from '@/components/GenerateWithAi.vue';

import { watchDebounced } from '@vueuse/core';
import { router, useForm } from '@inertiajs/vue3';
import axios from 'axios';
import { ref } from 'vue';

interface Kanban {
  id: number;
  name: string;
  workspace_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  columns: Column[];
}

interface Column {
  id: number;
  name: string;
  cards: Card[];
}

interface Card {
  id: number;
  title: string;
  description: string;
  order: number;
  column_id: number;
  tasks: Task[];
  column: Column;
  tags: string[];
}

interface Task {
  id: number;
  title: string;
  description: string;
  done: boolean;
}

interface Tag {
  id: number;
  name: string;
  color: string;
}

const props = defineProps<{
  kanban: Kanban;
  tags: Tag[];
  clients: any[];
  filters: Object;
}>();

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Kanban',
    href: '/kanban',
  },
  {
    title: props.kanban.name,
    href: route('kanban.show', { kanban: props.kanban.id }),
  }
];

const selectedCard = ref<Card | null>(null);

const handleCardSelect = (card: Card) => {
  selectedCard.value = card;
};

const columns = ref<Column[]>(props.kanban.columns);

const filtersForm = useForm({
  search: props.filters?.search || '',
});

const submitFilters = () => {
  filtersForm.get(route('kanban.show', { kanban: props.kanban.id, search: filtersForm.search }), {
    onError: (errors) => {
      console.log('Error updating filters:', errors);
    },
    replace: true,
  });
};

const updateColumnCards = async (columnId: number) => {
  try {
    const response = await axios.get(route('columns.get.cards', { column: columnId }));
    const columnIndex = columns.value.findIndex(col => col.id === columnId);

    if (columnIndex !== -1) {
      columns.value[columnIndex].cards = [...response.data];
    }
  } catch (error) {
    console.error('Error updating column cards:', error);
  }
};

const handleCardMove = (event: { added?: { element: Card; newIndex: number } }) => {
  const { added } = event;
  if (!added) return;

  const card = added.element;
  const newColumnId = columns.value.find(col => col.cards.includes(card))?.id;

  if (newColumnId) {
    router.put(route('cards.update', { card: card.id }), {
      column_id: newColumnId,
      title: card.title,
      description: card.description,
      order: added.newIndex
    }, {
      onSuccess: () => {
        // Update both the source and destination columns
        const sourceColumn = columns.value.find(col => col.id === card.column_id);
        const destColumn = columns.value.find(col => col.id === newColumnId);
        if (sourceColumn) updateColumnCards(sourceColumn.id);
        if (destColumn) updateColumnCards(destColumn.id);
      }
    });
  }
};



watchDebounced(
  () => filtersForm.search,
  () => {
    submitFilters();
  },
  { deep: true, debounce: 1000 }
);
</script>

<template>

  <Head :title="`Kanban - ${kanban.name}`" />
  <AppLayout :breadcrumbs="breadcrumbs">
    <EditCard :card="selectedCard" :clients="clients" @unselect="selectedCard = null" @update="updateColumnCards" />

    <div class="flex p-4 justify-between gap-3 flex-wrap">
      <div class="flex items-center gap-3 flex-wrap">
        <h1 class="text-lg font-bold text-black dark:text-white ">
          {{ kanban.name }}
        </h1>

        <EditKanban :kanban="kanban" />

        <div class="lg:w-[700px] w-auto">
          <Label for="search" class="col-span-1 hidden">Search</Label>
          <Input id="search" type="search" placeholder="Search" v-model="filtersForm.search" />
        </div>
      </div>

      <GenerateWithAi :kanban="kanban" :columns="columns" @submit="updateColumnCards" />
    </div>


    <div class="flex h-full gap-4 overflow-x-auto p-4">
      <KanbanColumn v-for="column in columns" :key="column.id" :column="column" :kanban-id="kanban.id"
        :clients="clients" @card-move="handleCardMove" @card-select="handleCardSelect"
        @update="updateColumnCards(column.id)" class="flex-shrink-0" />
    </div>
  </AppLayout>
</template>
