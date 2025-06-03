<script setup lang="ts">
import { ref } from 'vue';
import KanbanColumn from '@/components/kanban/KanbanColumn.vue';
import KanbanCard from '@/components/kanban/KanbanCard.vue';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import draggable from 'vuedraggable';
import { router, useForm } from '@inertiajs/vue3';
import AlertDialog from '../ui/alert-dialog/AlertDialog.vue';
import AlertDialogTrigger from '../ui/alert-dialog/AlertDialogTrigger.vue';
import AlertDialogContent from '../ui/alert-dialog/AlertDialogContent.vue';
import AlertDialogHeader from '../ui/alert-dialog/AlertDialogHeader.vue';
import AlertDialogDescription from '../ui/alert-dialog/AlertDialogDescription.vue';
import AlertDialogFooter from '../ui/alert-dialog/AlertDialogFooter.vue';
import AlertDialogTitle from '../ui/alert-dialog/AlertDialogTitle.vue';
import Button from '../ui/button/Button.vue';

interface Card {
    id: number;
    title: string;
    description: string;
    order: number;
    column_id: number;
}

interface Column {
    id: number;
    name: string;
    cards: Card[];
}

interface CardFormData {
    title: string;
    description: string;
    column_id: number | null;
    order: number;
    [key: string]: string | number | null;
}

interface InertiaResponse {
    props: {
        card: Card;
    };
}

const props = defineProps<{
    kanban: {
        id: number;
        name: string;
        columns: Column[];
    };
}>();

const columns = ref<Column[]>(props.kanban.columns);

// Card management state
const isCardModalOpen = ref(false);
const isNewCard = ref(false);
const selectedCard = ref<Card | null>(null);

// Unified form for both new and edit card
const cardForm = useForm<CardFormData>({
    title: '',
    description: '',
    column_id: null,
    order: 0,
});

// Open modal for new card
const openNewCardModal = (columnId: number) => {
    isNewCard.value = true;
    selectedCard.value = null;
    cardForm.reset();
    cardForm.column_id = columnId;
    isCardModalOpen.value = true;
};

// Open modal for editing card
const openCardDetails = (card: Card) => {
    isNewCard.value = false;
    selectedCard.value = card;
    cardForm.reset();
    cardForm.title = card.title;
    cardForm.description = card.description;
    cardForm.column_id = card.column_id;
    cardForm.order = card.order;
    isCardModalOpen.value = true;
};

// Handle card creation/update
const handleCardSubmit = () => {
    if (!cardForm.column_id) return;

    if (isNewCard.value) {
        cardForm.post(route('cards.store', { kanban: props.kanban.id }), {
            onSuccess: (response: InertiaResponse) => {
                // Add the new card to the appropriate column
                const column = columns.value.find(col => col.id === cardForm.column_id);
                if (column && response.props.card) {
                    column.cards.push(response.props.card);
                }
                isCardModalOpen.value = false;
                cardForm.reset();
            }
        });
    } else if (selectedCard.value) {
        cardForm.patch(route('cards.update', { card: selectedCard.value.id }), {
            onSuccess: (response: InertiaResponse) => {
                // Update the card in the appropriate column
                const column = columns.value.find(col => col.id === cardForm.column_id);
                if (column && response.props.card) {
                    const cardIndex = column.cards.findIndex(card => card.id === selectedCard.value?.id);
                    if (cardIndex !== -1) {
                        column.cards[cardIndex] = response.props.card;
                    }
                }
                isCardModalOpen.value = false;
            }
        });
    }
};

// Handle card deletion
const deleteCard = () => {
    if (!selectedCard.value) return;

    router.delete(route('cards.delete', { card: selectedCard.value.id }), {
        onSuccess: () => {
            // Remove the card from the appropriate column
            const column = columns.value.find(col => col.id === selectedCard.value?.column_id);
            if (column) {
                column.cards = column.cards.filter(card => card.id !== selectedCard.value?.id);
            }
            isCardModalOpen.value = false;
        }
    });
};

// Handle card drag and drop
const handleCardMove = (event: { added?: { element: Card; newIndex: number } }) => {
    const { added } = event;
    if (!added) return;

    const card = added.element;
    const newColumnId = columns.value.find(col => col.cards.includes(card))?.id;

    if (newColumnId) {
        router.patch(route('cards.update', { card: card.id }), {
            column_id: newColumnId,
            title: card.title,
            description: card.description,
            order: added.newIndex
        });
    }
};
</script>

<template>
    <div class="flex justify-between items-center px-4">
        <h1 class="text-lg font-bold text-black dark:text-white">
            {{ kanban.name }}
        </h1>
    </div>
    <div class="flex h-full gap-4 overflow-x-auto px-4">
        <KanbanColumn v-for="column in columns" :key="column.id" :name="column.name"
            @add-card="openNewCardModal(column.id)">
            <draggable :list="column.cards" :group="{ name: 'cards' }" item-key="id" class="flex flex-1 flex-col gap-2"
                @change="handleCardMove">
                <template #item="{ element }">
                    <KanbanCard :title="element.title" :description="element.description"
                        @click="openCardDetails(element)" />
                </template>
            </draggable>
        </KanbanColumn>

        <!-- Card Modal (New/Edit) -->
        <Sheet v-model:open="isCardModalOpen">
            <SheetContent class="sm:max-w-[425px]">
                <SheetHeader>
                    <SheetTitle>{{ isNewCard ? 'Add New Card' : 'Edit Card' }}</SheetTitle>
                    <SheetDescription>
                        {{ isNewCard ? 'Create a new card for your kanban board.' : 'Edit the details of the card.' }}
                    </SheetDescription>
                </SheetHeader>
                <form @submit.prevent="handleCardSubmit" class="px-4">
                    <div class="grid gap-4 py-4">
                        <div class="grid gap-2">
                            <label for="title" class="text-sm font-medium">Title</label>
                            <input id="title" v-model="cardForm.title" class="rounded-md border px-3 py-2"
                                placeholder="Enter card title" />
                        </div>
                        <div class="grid gap-2">
                            <label for="description" class="text-sm font-medium">Description</label>
                            <textarea id="description" v-model="cardForm.description"
                                class="rounded-md border px-3 py-2" placeholder="Enter card description" rows="4" />
                        </div>
                    </div>
                    <div class="mt-4 flex justify-between gap-3">
                        <AlertDialog v-if="!isNewCard">
                            <AlertDialogTrigger>
                                <Button variant="destructive" type="button">
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogDescription>
                                    This action cannot be undone.
                                </AlertDialogDescription>
                                <AlertDialogFooter>
                                    <Button variant="outline" type="button" @click="isCardModalOpen = false">
                                        Cancel
                                    </Button>
                                    <Button variant="destructive" type="button" @click="deleteCard">
                                        Delete
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <div class="flex gap-3">
                            <Button variant="outline" type="button" @click="isCardModalOpen = false">
                                Cancel
                            </Button>
                            <Button type="submit" variant="default">
                                {{ isNewCard ? 'Create' : 'Update' }}
                            </Button>
                        </div>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    </div>
</template>