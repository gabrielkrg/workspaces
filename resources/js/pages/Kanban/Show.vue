<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import KanbanCard from '@/components/kanban/KanbanCard.vue';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import draggable from 'vuedraggable';
import { router, useForm } from '@inertiajs/vue3';
import { ref, watch } from 'vue';
import Button from '@/components/ui/button/Button.vue';
import { Plus } from 'lucide-vue-next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

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
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Kanban',
    href: '/kanban',
  },
];

const props = defineProps<{
  kanban: Kanban;
}>();

const columns = ref<Column[]>(props.kanban.columns);

// Unified form for both new and edit card
const card = useForm({
  title: '',
  description: '',
  column_id: null as number | null,
  order: 0,
});

const createCard = (columnId: number) => {
  card.column_id = columnId;

  card.post(route('cards.store', { kanban: props.kanban.id }), {
    onSuccess: () => {
      // Find the column and push a new card
      const column = columns.value.find(col => col.id === columnId);
      if (column) {
        // Create a new card object (you may want to get the real ID from the server)
        const newCard = {
          id: Date.now(), // Temporary ID, ideally get from server
          title: card.title,
          description: card.description,
          order: column.cards.length,
          column_id: columnId,
        };
        column.cards.push(newCard);
      }
      card.reset();
    }
  });
}

const selectedCard = ref<Card | null>(null);

const updateCardForm = useForm({
  title: '',
  description: '',
  column_id: null as number | null,
  order: 0,
});

const editModalOpen = ref(false);

const selectCard = (card: Card) => {
  editModalOpen.value = true;

  selectedCard.value = card;
  updateCardForm.title = card.title;
  updateCardForm.description = card.description;
  updateCardForm.column_id = card.column_id;
  updateCardForm.order = card.order;
};

const updateCard = (cardId: number) => {
  if (selectedCard.value == null) return;

  updateCardForm.put(route('cards.update', cardId), {
    onSuccess: () => {
      updateCardForm.reset();
      selectedCard.value = null;
      editModalOpen.value = false;
    }
  });
};

const deleteCard = (cardId: number) => {
  if (selectedCard.value == null) return;

  updateCardForm.delete(route('cards.delete', cardId), {
    onSuccess: () => {
      // Find and remove the card from the columns array
      columns.value = columns.value.map(column => ({
        ...column,
        cards: column.cards.filter(card => card.id !== cardId)
      }));
      selectedCard.value = null;
      editModalOpen.value = false;
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
    router.put(route('cards.update', { card: card.id }), {
      column_id: newColumnId,
      title: card.title,
      description: card.description,
      order: added.newIndex
    });
  }
};

watch(columns, (newColumns) => {
  console.log(newColumns);
});

</script>

<template>

  <Head :title="`Kanban - ${kanban.name}`" />

  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
      <div class="flex justify-between items-center px-4">
        <h1 class="text-lg font-bold text-black dark:text-white">
          {{ kanban.name }}
        </h1>
      </div>
      <div class="flex h-full gap-4 overflow-x-auto px-4">
        <div
          class="flex h-full w-72 flex-shrink-0 flex-col p-4 bg-sidebar-accent border-sidebar-border rounded-xl border"
          v-for="column in columns" :key="column.id">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="font-semibold text-black dark:text-white">{{ column.name }}</h3>
            <Sheet>
              <SheetTrigger as-child>
                <div
                  class="cursor-pointer p-2 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-md">
                  <Plus class="h-5 w-5" />
                </div>
              </SheetTrigger>
              <SheetContent :class="cn('overflow-y-auto')">
                <SheetHeader>
                  <SheetTitle>New Card</SheetTitle>
                  <SheetDescription>
                    Create a new card for your kanban board.
                  </SheetDescription>
                </SheetHeader>

                <form @submit.prevent="createCard(column.id)" class="px-4">
                  <div class="grid gap-4 py-4">
                    <div class="grid gap-2">
                      <Label for="title" class="text-sm font-medium">Title</Label>
                      <Input id="title" v-model="card.title" class="rounded-md border px-3 py-2"
                        placeholder="Enter card title" />
                    </div>
                    <div class="grid gap-2">
                      <Label for="description" class="text-sm font-medium">Description</Label>
                      <Textarea id="description" v-model="card.description" class="rounded-md border px-3 py-2"
                        placeholder="Enter card description" rows="4" />
                    </div>
                  </div>
                  <SheetFooter :class="{ 'hidden': card.processing }" class="p-0">
                    <SheetClose as-child>
                      <Button type="submit" class="cursor-pointer"> Save </Button>
                    </SheetClose>
                  </SheetFooter>
                </form>
              </SheetContent>
            </Sheet>
          </div>

          <div class="flex flex-1 flex-col gap-2 overflow-y-auto">
            <draggable :list="column.cards" :group="{ name: 'cards' }" item-key="id" class="flex flex-1 flex-col gap-2"
              @change="handleCardMove">
              <template #item="{ element }">
                <KanbanCard :title="element.title" :description="element.description" @click="selectCard(element)"
                  class="cursor-pointer" />
              </template>
            </draggable>
          </div>
        </div>
      </div>
    </div>

    <Sheet v-model:open="editModalOpen">
      <SheetContent :class="cn('overflow-y-auto')">
        <SheetHeader>
          <SheetTitle>Edit Card</SheetTitle>
          <SheetDescription>
            Edit the card for your kanban board.
          </SheetDescription>
        </SheetHeader>

        <form @submit.prevent="selectedCard && updateCard(selectedCard.id)" class="px-4">
          <div class="grid gap-4 py-4">
            <div class="grid gap-2">
              <Label for="title" class="text-sm font-medium">Title</Label>
              <Input id="title" v-model="updateCardForm.title" class="rounded-md border px-3 py-2"
                placeholder="Enter card title" />
            </div>
            <div class="grid gap-2">
              <Label for="description" class="text-sm font-medium">Description</Label>
              <Textarea id="description" v-model="updateCardForm.description" class="rounded-md border px-3 py-2"
                placeholder="Enter card description" rows="4" />
            </div>
          </div>
          <div class="flex justify-between gap-2">
            <Dialog>
              <DialogTrigger as-child>
                <Button variant="destructive">
                  Delete
                </Button>
              </DialogTrigger>

              <DialogContent>
                <form class="space-y-6" @submit.prevent="selectedCard && deleteCard(selectedCard.id)">
                  <DialogHeader class="space-y-3">
                    <DialogTitle>Are you sure you want to delete this card?
                    </DialogTitle>
                    <DialogDescription>
                      Once your card is deleted, there's no way to recover
                      it.
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter class="gap-2">
                    <DialogClose as-child>
                      <Button variant="secondary">Cancel</Button>
                    </DialogClose>

                    <Button variant="destructive" :disabled="updateCardForm.processing">
                      <button type="submit">Delete card</button>
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <div class="flex justify-end gap-2">
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <SheetClose asChild>
                <Button type="submit">Save Changes</Button>
              </SheetClose>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  </AppLayout>
</template>
