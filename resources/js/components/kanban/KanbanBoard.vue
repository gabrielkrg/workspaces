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
    title: string;
    description: string;
    order: number;
    column_id: number;
    id: number;
}

interface Column {
    id: number;
    name: string;
    cards: Card[];
}

const props = defineProps({
    kanban: Object,
});

const columns = ref<Column[]>(props.kanban?.columns);

const activeColumn = ref<number | null>(null);
const isNewCardModalOpen = ref(false);

const openNewCardModal = (columnId: number) => {
    activeColumn.value = columnId;
    isNewCardModalOpen.value = true;

    formCard.column_id = columnId;
};

const formCard = useForm({
    title: '',
    description: '',
    column_id: activeColumn.value,
    order: 0,
});

const createCard = () => {
    if (!activeColumn.value) return;

    formCard.post(route('cards.store', { kanban: props.kanban?.id }), {
        onSuccess: () => {
            isNewCardModalOpen.value = false;
            formCard.reset();
        }
    });
};

const isCardModalOpen = ref(false);
const selectedCard = ref<Card | null>(null);

const openCardDetails = (card: Card) => {
    selectedCard.value = card;
    isCardModalOpen.value = true;

    formUpdateCard.title = card.title;
    formUpdateCard.description = card.description;
    formUpdateCard.order = card.order;
    formUpdateCard.column_id = card.column_id;
};

const formUpdateCard = useForm({
    title: '',
    description: '',
    order: 0,
    column_id: activeColumn.value,
});

const updateCard = () => {
    if (!selectedCard.value) return;

    formUpdateCard.patch(route('cards.update', { card: selectedCard?.value?.id }), {
        onSuccess: () => {
            isCardModalOpen.value = false;
        }
    });
};

const deleteCard = () => {
    if (!selectedCard.value) return;

    router.delete(route('cards.delete', { card: selectedCard?.value?.id }), {
        onSuccess: () => {
            isCardModalOpen.value = false;
        }
    });
};

const handleCardMove = (event: any) => {
    const { added, removed } = event;
    if (added) {
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
    }
};
</script>

<template>
    <div class="flex justify-between items-center px-4">
        <h1 class="text-lg font-bold">
            {{ kanban?.name }}
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

        <!-- New Card Modal -->
        <Sheet v-model:open="isNewCardModalOpen">
            <SheetContent class="sm:max-w-[425px]">
                <SheetHeader>
                    <SheetTitle>Add New Card</SheetTitle>
                    <SheetDescription>
                        Create a new card for your kanban board. Fill in the details below.
                    </SheetDescription>
                </SheetHeader>
                <form @submit.prevent="createCard" class="px-4">
                    <div class="grid gap-4 py-4">
                        <div class="grid gap-2">
                            <label for="title" class="text-sm font-medium">Title</label>
                            <input id="title" v-model="formCard.title" class="rounded-md border px-3 py-2"
                                placeholder="Enter card title" />
                        </div>
                        <div class="grid gap-2">
                            <label for="description" class="text-sm font-medium">Description</label>
                            <textarea id="description" v-model="formCard.description"
                                class="rounded-md border px-3 py-2" placeholder="Enter card description" rows="4" />
                        </div>
                    </div>
                    <div class="mt-4 flex justify-end gap-3">
                        <button @click="isNewCardModalOpen = false" type="button"
                            class="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
                            Cancel
                        </button>
                        <button type="submit"
                            class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                            Create
                        </button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>

        <!-- Card Details Modal -->
        <Sheet v-model:open="isCardModalOpen">
            <SheetContent class="sm:max-w-[425px]">
                <SheetHeader>
                    <SheetTitle>{{ selectedCard?.title }}</SheetTitle>
                    <SheetDescription>
                        Edit the details of the card.
                    </SheetDescription>
                </SheetHeader>
                <form @submit.prevent="updateCard" class="px-4">
                    <div class="grid gap-4 py-4">
                        <div class="grid gap-2">
                            <label for="title" class="text-sm font-medium">Title</label>
                            <input id="title" v-model="formUpdateCard.title" class="rounded-md border px-3 py-2"
                                placeholder="Enter card title" />
                        </div>
                        <div class="grid gap-2">
                            <label for="description" class="text-sm font-medium">Description</label>
                            <textarea id="description" v-model="formUpdateCard.description"
                                class="rounded-md border px-3 py-2" placeholder="Enter card description" rows="4" />
                        </div>
                    </div>
                    <div class="mt-4 flex justify-between gap-3">
                        <AlertDialog>
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
                                Update
                            </Button>
                        </div>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    </div>
</template>