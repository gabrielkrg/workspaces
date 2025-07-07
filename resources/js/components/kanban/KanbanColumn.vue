<script setup lang="ts">
import { Label } from '@/components/ui/label';
import KanbanCard from '@/components/kanban/KanbanCard.vue';
import CreateCard from '@/components/kanban/CreateCard.vue';
import draggable from 'vuedraggable';

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

interface Props {
    column: Column;
    kanbanId: number;
    clients: any[];
}

interface Emits {
    (e: 'cardMove', event: { added?: { element: Card; newIndex: number } }): void;
    (e: 'cardSelect', card: Card): void;
    (e: 'update'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const handleCardMove = (event: { added?: { element: Card; newIndex: number } }) => {
    emit('cardMove', event);
};

const handleCardSelect = (card: Card) => {
    emit('cardSelect', card);
};

</script>

<template>
    <div
        class="flex h-full md:max-h-[calc(100vh-11rem)] w-72 flex-shrink-0 flex-col p-4 bg-sidebar-accent border-sidebar-border rounded-xl border">
        <div class="mb-4 flex items-center justify-between">
            <h3 class="font-semibold text-black dark:text-white">{{ column.name }}</h3>
            <CreateCard :column_id="column.id" :kanban_id="kanbanId" :clients="clients" @update="$emit('update')" />
        </div>
        <div class="flex flex-1 flex-col gap-2 overflow-y-auto pr-2">
            <draggable :list="column.cards" :group="{ name: 'cards' }" item-key="id" class="flex flex-1 flex-col gap-2"
                @change="handleCardMove">
                <template #item="{ element }">
                    <KanbanCard :card="element" class="cursor-pointer" @click="handleCardSelect(element)" />
                </template>
            </draggable>
        </div>
    </div>
</template>