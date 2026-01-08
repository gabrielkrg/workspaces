<script setup lang="ts">
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/vue3';
import { Textarea } from '@/components/ui/textarea';
import { computed, onMounted, ref, watch } from 'vue';
import { router } from '@inertiajs/vue3';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import TasksCard from '@/components/kanban/TasksCard.vue';
import { Combobox, ComboboxAnchor, ComboboxInput, ComboboxList, ComboboxEmpty, ComboboxGroup, ComboboxItem } from '@/components/ui/combobox';
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input';
import { useFilter } from 'reka-ui';
import axios from 'axios';
import type { KanbanCard } from '@/types';

const props = defineProps<{
    card: KanbanCard | null;
    clients: any[];
}>();

const emit = defineEmits(['update', 'unselect']);

const isOpen = ref(false);
const clients = ref(props.clients);
const tags = ref<any[]>([]);

const openSearchTerm = ref(false)
const searchTerm = ref('')

const { contains } = useFilter({ sensitivity: 'base' })

const filteredTags = computed(() => {
    const options = tags.value.filter(i => !form.tags.includes(i.name))
    return searchTerm.value ? options.filter(option => contains(option.name, searchTerm.value)) : options
})

const form = useForm({
    title: '',
    description: '',
    column_id: null as number | null,
    order: null as number | null,
    client_id: null as number | null,
    tasks: [] as any[],
    tags: [] as string[],
});

const updateCard = () => {
    if (!props.card) return;

    form.put(route('cards.update', props.card.id), {
        preserveScroll: true,
        onSuccess: () => {
            emit('update', form.column_id);
            isOpen.value = false;
            form.reset();
        },
        onError: (errors) => {
            console.log('Error updating card:', errors);
        }
    });
};

const deleteCard = () => {
    if (!props.card) return;

    router.delete(route('cards.delete', { card: props.card.id }), {
        onSuccess: () => {
            emit('update', form.column_id);
            isOpen.value = false;
            form.reset();
        },
        onError: (errors) => {
            console.error('Error deleting card:', errors);
        }
    });
};

watch(() => props.card, (newCard) => {
    if (newCard) {
        isOpen.value = true;

        form.title = newCard.title;
        form.description = newCard.description;
        form.column_id = newCard.column_id;
        form.order = newCard.order;
        form.tags = newCard.tags.map((tag) => tag.name) || [];
        form.client_id = newCard.client_id;
    } else {
        isOpen.value = false;
    }
}, { immediate: true });

onMounted(async () => {
    const response = await axios.get(route('api.tags'));
    tags.value = response.data;
})

</script>

<template>
    <Sheet v-model:open="isOpen" @update:open="$emit('unselect')">
        <SheetContent :class="cn('overflow-y-auto')">
            <SheetHeader>
                <SheetTitle>Edit Card</SheetTitle>
                <SheetDescription>
                    Edit the card for your kanban board.
                </SheetDescription>
            </SheetHeader>

            <form @submit.prevent="updateCard()" class="px-4">
                <div class="grid gap-4 py-4">
                    <div class="grid gap-2">
                        <Label for="title" class="text-sm font-medium">Title</Label>
                        <Input id="title" v-model="form.title" class="rounded-md border px-3 py-2"
                            placeholder="Enter card title" />
                        <span v-if="form.errors.title" class="text-sm text-red-500 col-span-full">
                            {{ form.errors.title }}
                        </span>
                    </div>

                    <div class="flex flex-col gap-4">
                        <Label for="title" class="text-right"> Client </Label>
                        <Select v-model="form.client_id" class="">
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
                            <Combobox v-model="form.tags" v-model:open="openSearchTerm" :ignore-filter="true">
                                <ComboboxAnchor as-child>
                                    <TagsInput :model-value="form.tags" @update:model-value="(val) => (form.tags = val)"
                                        :class="cn('p-0 gap-0 w-full bg-input/30')">

                                        <div
                                            :class="['flex gap-2 flex-wrap items-center', form.tags.length > 0 ? 'p-2' : '']">
                                            <TagsInputItem v-for="tag in form.tags" :key="tag" :value="tag">
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
                                                        form.tags.push(ev.detail.value)
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

                            <span class="text-xs text-gray-500">
                                Use comma <span class="font-bold">( ,
                                    )</span> to
                                add
                            </span>
                        </div>

                        <div v-if="form.errors.tags" class="text-sm text-red-500">
                            {{ form.errors.tags }}
                        </div>
                    </div>

                    <div class="grid gap-2">
                        <Label for="description" class="text-sm font-medium">Description</Label>
                        <Textarea id="description" v-model="form.description" class="rounded-md border px-3 py-2"
                            placeholder="Enter card description" rows="4" />
                        <span v-if="form.errors.description" class="text-sm text-red-500">
                            {{ form.errors.description }}
                        </span>
                    </div>

                    <TasksCard :card="card" v-if="card?.tasks" />

                </div>

                <div class="flex flex-wrap space-y-2 justify-between gap-2">
                    <div class="">
                        <Dialog class="">
                            <DialogTrigger as-child>
                                <Button variant="destructive">
                                    Delete
                                </Button>
                            </DialogTrigger>

                            <DialogContent>
                                <form class="space-y-6" @submit.prevent="deleteCard()">
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

                                        <Button variant="destructive" :disabled="form.processing">
                                            <button type="submit">Delete card</button>
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div class="flex justify-end gap-2">
                        <SheetClose asChild>
                            <Button variant="outline" type="button" class="cursor-pointer">Cancel</Button>
                        </SheetClose>

                        <Button type="submit" :disabled="form.processing" class="cursor-pointer">Save</Button>
                    </div>
                </div>
            </form>
        </SheetContent>
    </Sheet>
</template>