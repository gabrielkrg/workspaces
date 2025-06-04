<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import KanbanCard from '@/components/kanban/KanbanCard.vue';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import draggable from 'vuedraggable';
import { router, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import Button from '@/components/ui/button/Button.vue';
import { Plus, Trash2, Check } from 'lucide-vue-next';
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
import axios from 'axios';

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
}

interface Task {
  id: number;
  title: string;
  description: string;
  done: boolean;
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
          tasks: [] // Add empty tasks array
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

  updateCardTasks(card.id);
};

const updateCard = (cardId: number) => {
  if (selectedCard.value == null) return;

  updateCardForm.put(route('cards.update', cardId), {
    preserveScroll: true,
    onSuccess: () => {
      // Update the card in the columns array
      columns.value = columns.value.map(column => ({
        ...column,
        cards: column.cards.map(card => {
          if (card.id === cardId) {
            return {
              ...card,
              title: updateCardForm.title,
              description: updateCardForm.description,
            };
          }
          return card;
        })
      }));

      updateCardForm.reset();
      selectedCard.value = null;
      editModalOpen.value = false;
    },
    onError: (errors) => {
      console.log('Error updating card:', errors);
    }
  });
};

const taskForm = useForm({
  title: '',
  description: '',
  done: false,
});

const attachTask = () => {
  if (selectedCard.value == null) return;

  taskForm.post(route('cards.attach.task', { card: selectedCard.value?.id }), {
    onSuccess: () => {

      updateCardTasks(selectedCard.value!.id);

      taskForm.reset();
    },
    onError: (errors) => {
      console.log('Error attaching task:', errors);
    }
  });
}

const updateTask = (task: Task, updates: Partial<Task>) => {
  if (selectedCard.value == null) return;

  router.put(route('tasks.update', task.id), { ...updates }, {
    onSuccess: () => {
      updateCardTasks(selectedCard.value!.id);
    }
  });
};

const deleteTask = (taskId: number) => {
  if (selectedCard.value == null) return;

  router.delete(route('tasks.delete', taskId), {
    onSuccess: () => {
      updateCardTasks(selectedCard.value!.id);
    }
  });
}

const deleteCard = (cardId: number) => {
  if (selectedCard.value == null) return;

  updateCardForm.delete(route('cards.delete', cardId), {
    onSuccess: () => {
      console.log('Card deleted');
    }
  });
};

const updateCardTasks = async (cardId: number) => {
  if (selectedCard.value == null) return;
  const response = await axios.get(route('cards.get.tasks', { card: cardId }));
  selectedCard.value.tasks = response.data.tasks;
}

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

            <div class="grid gap-2">
              <Label for="tasks" class="text-sm font-medium">Tasks</Label>
              <div v-for="task in selectedCard?.tasks" :key="task.id">
                <div class="group flex justify-between items-center gap-4 border-b py-1">
                  <div class="flex items-center gap-2">
                    <label class="inline-flex cursor-pointer items-center">
                      <input type="checkbox" :checked="task.done" @change="updateTask(task, { done: !task.done })"
                        class="peer sr-only" />
                      <div
                        class="flex h-5 w-5 items-center justify-center rounded border-2 border-gray-300 transition-colors duration-300 peer-checked:border-green-600 peer-checked:bg-green-600">
                        <Check v-if="task.done" class="h-4 w-4 text-white" />
                      </div>
                    </label>

                    <h3 :class="{ 'line-through': task.done }">
                      {{ task.title }}
                    </h3>
                  </div>

                  <Dialog>
                    <DialogTrigger as-child>
                      <Button variant="destructive" type="button" size="icon">
                        <Trash2 class="w-4 h-4" />
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <form class="space-y-6" @submit.prevent="deleteTask(task.id)">
                        <DialogHeader class="space-y-3">
                          <DialogTitle>Are you sure you want to delete this task?
                          </DialogTitle>
                          <DialogDescription>
                            Once your task is deleted, there's no way to recover
                            it.
                          </DialogDescription>
                        </DialogHeader>

                        <DialogFooter class="gap-2">
                          <DialogClose as-child>
                            <Button variant="secondary">Cancel</Button>
                          </DialogClose>

                          <DialogClose as-child>
                            <Button variant="destructive" :disabled="updateCardForm.processing" type="submit">
                              Delete task
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <Dialog>
                <DialogTrigger as-child>
                  <Button variant="outline">
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent class="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Task</DialogTitle>
                    <DialogDescription>
                      Add a new task to your card.
                    </DialogDescription>
                  </DialogHeader>
                  <form @submit.prevent="attachTask">
                    <div class="grid gap-4 py-4">
                      <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="title" class="text-right">
                          Title
                        </Label>
                        <Input id="title" v-model="taskForm.title" class="col-span-3" />
                      </div>
                      <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="description" class="text-right">
                          Description
                        </Label>
                        <Textarea id="description" v-model="taskForm.description" class="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter class="gap-2">
                      <DialogClose as-child>
                        <Button variant="secondary">Cancel</Button>
                      </DialogClose>
                      <DialogClose as-child>
                        <Button type="submit">
                          Save changes
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
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
