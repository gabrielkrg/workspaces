<script setup lang="ts">
import KanbanCard from '@/components/kanban/KanbanCard.vue';
import CreateCard from '@/components/kanban/CreateCard.vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import draggable from 'vuedraggable';
import type { KanbanColumn, KanbanCard as KanbanCardType } from '@/types';

interface Props {
    column: KanbanColumn;
    kanbanId: number;
    clients: any[];
}

interface Emits {
    (e: 'cardMove', event: { added?: { element: KanbanCardType; newIndex: number } }): void;
    (e: 'cardSelect', card: KanbanCardType): void;
    (e: 'update'): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const handleCardMove = (event: { added?: { element: KanbanCardType; newIndex: number } }) => {
    emit('cardMove', event);
};

const handleCardSelect = (card: KanbanCardType) => {
    emit('cardSelect', card);
};

</script>

<template>
    <Card class="h-full md:max-h-[calc(100vh-12rem)] md:w-72 w-56 gap-2 bg-sidebar-accent">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">
                {{ column.name }}
            </CardTitle>
            <CreateCard :column_id="column.id" :kanban_id="kanbanId" :clients="clients" @update="$emit('update')"
                class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent class="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
            <draggable :list="column.cards" :group="{ name: 'cards' }" item-key="id" class="flex flex-1 flex-col gap-2"
                @change="handleCardMove">
                <template #item="{ element }">
                    <KanbanCard :card="element" class="cursor-pointer" @click="handleCardSelect(element)" />
                </template>
            </draggable>
        </CardContent>
    </Card>
</template>