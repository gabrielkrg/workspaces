<script setup lang="ts">
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/AppLayout.vue';
import { Head } from '@inertiajs/vue3';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import KanbanCard from '@/components/kanban/KanbanCard.vue';
import EditCard from '@/components/kanban/EditCard.vue';
import EditKanban from '@/components/kanban/EditKanban.vue';
import CreateCard from '@/components/kanban/CreateCard.vue';

import draggable from 'vuedraggable';
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
    <EditCard :card="selectedCard" :clients="clients" @update="updateColumnCards" />

    <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
      <div class="flex justify-start items-center gap-3 px-4 ">
        <h1 class="text-lg font-bold text-black dark:text-white">
          {{ kanban.name }}
        </h1>

        <EditKanban :kanban="kanban" />

        <div class="grid grid-cols-3 w-full max-w-sm gap-1.5">
          <Label for="search" class="col-span-1 hidden">Search</Label>
          <Input id="search" type="search" placeholder="Search" v-model="filtersForm.search" class="col-span-full" />
        </div>
      </div>

      <div class="flex h-full gap-4 overflow-x-auto px-4">
        <div
          class="flex h-full md:max-h-[calc(100vh-11rem)] w-72 flex-shrink-0 flex-col p-4 bg-sidebar-accent border-sidebar-border rounded-xl border"
          v-for="column in columns" :key="column.id">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="font-semibold text-black dark:text-white">{{ column.name }}</h3>
            <CreateCard :column_id="column.id" :kanban_id="kanban.id" :clients="clients" @update="updateColumnCards" />
          </div>
          <div class="flex flex-1 flex-col gap-2 overflow-y-auto pr-2">
            <draggable :list="column.cards" :group="{ name: 'cards' }" item-key="id" class="flex flex-1 flex-col gap-2"
              @change="handleCardMove">
              <template #item="{ element }">
                <KanbanCard :card="element" class="cursor-pointer" @click="selectedCard = element" />
              </template>
            </draggable>
          </div>
        </div>
      </div>
    </div>

  </AppLayout>
</template>
