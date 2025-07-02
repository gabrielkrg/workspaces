<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import KanbanCard from '@/components/kanban/KanbanCard.vue';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import draggable from 'vuedraggable';
import { router, useForm } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
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
import { useFilter } from 'reka-ui';
import {
  Combobox,
  ComboboxAnchor,
  ComboboxInput,
  ComboboxList,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
} from '@/components/ui/combobox';
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Kanban',
    href: '/kanban',
  },
];

const props = defineProps<{
  kanban: Kanban;
  tags: Tag[];
  clients: any[];
}>();

const columns = ref<Column[]>(props.kanban.columns);

const openSearchTerm = ref(false)
const searchTerm = ref('')

const { contains } = useFilter({ sensitivity: 'base' })

const filteredTags = computed(() => {
  const options = props.tags.filter(i => !card.tags.includes(i.name))
  return searchTerm.value ? options.filter(option => contains(option.name, searchTerm.value)) : options
})

// Unified form for both new and edit card
const card = useForm({
  title: '',
  description: '',
  column_id: null as number | null,
  order: 0,
  tags: [] as string[],
  client_id: null as number | null,
});

const createCard = (column: Column) => {
  card.column_id = column.id;

  card.post(route('cards.store', { kanban: props.kanban.id }), {
    onSuccess: (response) => {
      updateColumnCards(column);
      card.reset();

      router.get(route('kanban.show', { kanban: props.kanban.id }), {
        preserveState: true,
        replace: true,
      });
    },
    onError: (errors) => {
      console.log('Error creating card:', errors);
    }
  });
}

const selectedCard = ref<Card | null>(null);

const updateCardForm = useForm({
  title: '',
  description: '',
  column_id: null as number | null,
  order: 0,
  tags: [] as string[],
  client_id: null as number | null,
});

const editModalOpen = ref(false);

const selectCard = (card: Card) => {
  editModalOpen.value = true;

  selectedCard.value = card;
  updateCardForm.title = card.title;
  updateCardForm.description = card.description;
  updateCardForm.column_id = card.column_id;
  updateCardForm.order = card.order;
  updateCardForm.tags = card.tags?.map(tag => tag.name) || [];
  updateCardForm.client_id = card.client_id;

  updateCardTasks(card);
};

const updateCard = (card: Card) => {
  if (selectedCard.value == null) return;

  updateCardForm.put(route('cards.update', card.id), {
    preserveScroll: true,
    onSuccess: (response) => {
      // Update the column's cards after successful update
      const column = columns.value.find(col => col.id === card.column_id);
      if (column) {
        updateColumnCards(column);
      }
      updateCardForm.reset();
      selectedCard.value = null;
      editModalOpen.value = false;

      router.get(route('kanban.show', { kanban: props.kanban.id }), {
        preserveState: true,
        replace: true,
      });
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

  taskForm.post(route('cards.attach.task', {
    card: selectedCard.value?.id,
    tags: selectedCard.value?.tags.map(tag => tag.name) || [],
    client_id: selectedCard.value?.client_id || null,
    kanban_id: props.kanban.id
  }), {
    onSuccess: () => {

      updateCardTasks(selectedCard.value!);

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
      updateCardTasks(selectedCard.value!);
    }
  });
};

const deleteTask = (taskId: number) => {
  if (selectedCard.value == null) return;

  router.delete(route('tasks.delete', taskId), {
    onSuccess: () => {
      updateCardTasks(selectedCard.value!);
    }
  });
}

const deleteCard = (cardId: number) => {
  if (selectedCard.value == null) return;

  router.delete(route('cards.delete', { kanban: props.kanban.id, card: cardId }), {
    onSuccess: () => {
      // Update the column's cards after successful deletion
      if (selectedCard.value) {
        const column = columns.value.find(col => col.id === selectedCard.value?.column_id);
        if (column) {
          updateColumnCards(column);
        }
      }
      selectedCard.value = null;
      editModalOpen.value = false;
    },
    onError: (errors) => {
      console.error('Error deleting card:', errors);
    }
  });
};

const updateCardTasks = async (card: Card) => {
  const response = await axios.get(route('cards.get.tasks', { card: card.id }));
  card.tasks = response.data.tasks;
}

const updateColumnCards = async (column: Column) => {
  try {
    const response = await axios.get(route('columns.get.cards', { column: column.id }));
    // Find the column in the reactive columns array and update its cards
    const columnIndex = columns.value.findIndex(col => col.id === column.id);
    if (columnIndex !== -1) {
      // Create a new array to trigger reactivity
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
        if (sourceColumn) updateColumnCards(sourceColumn);
        if (destColumn) updateColumnCards(destColumn);
      }
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
                  <SheetTitle>Create Card</SheetTitle>
                  <SheetDescription>
                    Create a new card for your kanban board.
                  </SheetDescription>
                </SheetHeader>

                <form @submit.prevent="createCard(column)" class="px-4">
                  <div class="grid gap-4 py-4">
                    <div class="grid gap-2">
                      <Label for="title" class="text-sm font-medium">Title</Label>
                      <Input id="title" v-model="card.title" class="rounded-md border px-3 py-2"
                        placeholder="Enter card title" />
                      <div v-if="card.errors.title" class="text-sm text-red-500 col-span-full">
                        {{ card.errors.title }}
                      </div>
                    </div>

                    <div class="flex flex-col gap-4">
                      <Label for="title" class="text-right"> Client </Label>
                      <Select v-model="card.client_id" class="">
                        <SelectTrigger id="role" class="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem v-for="client in clients" :key="client.id" :value="client.id">
                            {{ client.name }}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div class="flex flex-col gap-4">
                      <Label for="title" class="text-right"> Tags </Label>
                      <div>
                        <Combobox v-model="card.tags" v-model:open="openSearchTerm" :ignore-filter="true">
                          <ComboboxAnchor as-child :class="cn('dark:bg-input/30')">
                            <TagsInput :model-value="card.tags" @update:model-value="(val) => (card.tags = val)"
                              :class="cn('p-0 gap-0 w-full bg-input/30')">

                              <div :class="['flex gap-2 flex-wrap items-center', card.tags.length > 0 ? 'p-2' : '']">
                                <TagsInputItem v-for="tag in card.tags" :key="tag" :value="tag">
                                  <TagsInputItemText />
                                  <TagsInputItemDelete />
                                </TagsInputItem>
                              </div>

                              <ComboboxInput v-model="searchTerm" as-child>
                                <TagsInputInput placeholder="Tags..."
                                  :class="cn('min-w-[200px] w-full p-0 focus-visible:ring-0 h-auto')"
                                  @keydown.enter.prevent />
                              </ComboboxInput>
                            </TagsInput>

                            <ComboboxList class="w-[--reka-popper-anchor-width]">
                              <ComboboxEmpty />
                              <ComboboxGroup>
                                <ComboboxItem v-for="tag in filteredTags" :key="tag.name" :value="tag.name"
                                  @select.prevent="(ev) => {
                                    if (typeof ev.detail.value === 'string') {
                                      searchTerm = ''
                                      card.tags.push(ev.detail.value)
                                    }

                                    if (filteredTags.length === 0) {
                                      openSearchTerm = false
                                    }
                                  }">
                                  {{ tag.name }}
                                </ComboboxItem>
                              </ComboboxGroup>
                            </ComboboxList>
                          </ComboboxAnchor>
                        </Combobox>

                        <span class="text-xs text-gray-500"> Use comma <span class="font-bold">( ,
                            )</span> to add </span>
                      </div>

                      <div v-if="card.errors.tags" class="text-sm text-red-500">
                        {{ card.errors.tags }}
                      </div>
                    </div>

                    <div class="grid gap-2">
                      <Label for="description" class="text-sm font-medium">Description</Label>
                      <Textarea id="description" v-model="card.description" class="rounded-md border px-3 py-2"
                        placeholder="Enter card description" rows="4" />
                      <div v-if="card.errors.description" class="text-sm text-red-500 col-span-full">
                        {{ card.errors.description }}
                      </div>
                    </div>
                  </div>
                  <SheetFooter :class="{ 'hidden': card.processing }" class="p-0">
                    <Button type="submit" class="cursor-pointer"> Save </Button>
                  </SheetFooter>
                </form>
              </SheetContent>
            </Sheet>
          </div>

          <div class="flex flex-1 flex-col gap-2 overflow-y-auto">
            <draggable :list="column.cards" :group="{ name: 'cards' }" item-key="id" class="flex flex-1 flex-col gap-2"
              @change="handleCardMove">
              <template #item="{ element }">
                <KanbanCard :title="element.title" :description="element.description" :tasks="element.tasks"
                  :tags="element.tags" @click="selectCard(element)" class="cursor-pointer" />

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

        <form @submit.prevent="selectedCard && updateCard(selectedCard)" class="px-4">
          <div class="grid gap-4 py-4">
            <div class="grid gap-2">
              <Label for="title" class="text-sm font-medium">Title</Label>
              <Input id="title" v-model="updateCardForm.title" class="rounded-md border px-3 py-2"
                placeholder="Enter card title" />
              <span v-if="updateCardForm.errors.title" class="text-sm text-red-500 col-span-full">
                {{ updateCardForm.errors.title }}
              </span>
            </div>

            <div class="flex flex-col gap-4">
              <Label for="title" class="text-right"> Client </Label>
              <Select v-model="updateCardForm.client_id" class="">
                <SelectTrigger id="role" class="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem v-for="client in clients" :key="client.id" :value="client.id">
                    {{ client.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="flex flex-col gap-4">
              <Label for="title" class="text-right"> Tags </Label>
              <div>
                <Combobox v-model="updateCardForm.tags" v-model:open="openSearchTerm" :ignore-filter="true">
                  <ComboboxAnchor as-child :class="cn('dark:bg-input/30')">
                    <TagsInput :model-value="updateCardForm.tags"
                      @update:model-value="(val) => (updateCardForm.tags = val)"
                      :class="cn('p-0 gap-0 w-full bg-input/30')">

                      <div :class="['flex gap-2 flex-wrap items-center', updateCardForm.tags.length > 0 ? 'p-2' : '']">
                        <TagsInputItem v-for="tag in updateCardForm.tags" :key="tag" :value="tag">
                          <TagsInputItemText />
                          <TagsInputItemDelete />
                        </TagsInputItem>
                      </div>

                      <ComboboxInput v-model="searchTerm" as-child>
                        <TagsInputInput placeholder="Tags..."
                          :class="cn('min-w-[200px] w-full p-0 focus-visible:ring-0 h-auto')" @keydown.enter.prevent />
                      </ComboboxInput>
                    </TagsInput>

                    <ComboboxList class="w-[--reka-popper-anchor-width]">
                      <ComboboxEmpty />
                      <ComboboxGroup>
                        <ComboboxItem v-for="tag in filteredTags" :key="tag.name" :value="tag.name" @select.prevent="(ev) => {
                          if (typeof ev.detail.value === 'string') {
                            searchTerm = ''
                            updateCardForm.tags.push(ev.detail.value)
                          }

                          if (filteredTags.length === 0) {
                            openSearchTerm = false
                          }
                        }">
                          {{ tag.name }}
                        </ComboboxItem>
                      </ComboboxGroup>
                    </ComboboxList>
                  </ComboboxAnchor>
                </Combobox>

                <span class="text-xs text-gray-500"> Use comma <span class="font-bold">( ,
                    )</span> to add </span>
              </div>

              <span v-if="updateCardForm.errors.tags" class="text-sm text-red-500">
                {{ updateCardForm.errors.tags }}
              </span>
            </div>



            <div class="grid gap-2">
              <Label for="description" class="text-sm font-medium">Description</Label>
              <Textarea id="description" v-model="updateCardForm.description" class="rounded-md border px-3 py-2"
                placeholder="Enter card description" rows="4" />
              <span v-if="updateCardForm.errors.description" class="text-sm text-red-500">
                {{ updateCardForm.errors.description }}
              </span>
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
                            <Button variant="secondary" type="button">Cancel</Button>
                          </DialogClose>

                          <Button variant="destructive" :disabled="updateCardForm.processing" type="submit">
                            Delete task
                          </Button>
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

                    <DialogFooter class="gap-2 flex justify-end">
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

              <span class="text-xs text-gray-500">
                Tasks created from here will have the tags and client of the card
              </span>
            </div>
          </div>

          <div class="flex flex-wrap space-y-2 justify-between gap-2">
            <div class="order-2 md:order-1">
              <Dialog class="">
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
            </div>

            <div class="flex justify-end gap-2 order-1 md:order-2">
              <SheetClose asChild>
                <Button variant="outline" type="button" class="cursor-pointer">Cancel</Button>
              </SheetClose>

              <Button type="submit" :disabled="updateCardForm.processing" class="cursor-pointer">Save
                Changes</Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  </AppLayout>
</template>
