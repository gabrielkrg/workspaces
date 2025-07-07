<script setup lang="ts">
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Combobox, ComboboxAnchor, ComboboxInput, ComboboxList, ComboboxEmpty, ComboboxGroup, ComboboxItem } from '@/components/ui/combobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-vue-next';
import { useForm } from '@inertiajs/vue3';
import { Textarea } from '@/components/ui/textarea';
import { useFilter } from 'reka-ui';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
    column_id: number;
    kanban_id: number;
    clients: any[] | null;
}>();

const emit = defineEmits(['update']);

const tags = ref<any[]>([]);

const openSearchTerm = ref(false)
const searchTerm = ref('')

const { contains } = useFilter({ sensitivity: 'base' })

const filteredTags = computed(() => {
    const options = tags.value.filter(i => !card.tags.includes(i.name))
    return searchTerm.value ? options.filter(option => contains(option.name, searchTerm.value)) : options
})

const card = useForm({
    title: '',
    description: '',
    column_id: null as number | null,
    order: 0,
    tags: [] as string[],
    client_id: null as number | null,
});

const createCard = () => {
    card.column_id = props.column_id;

    card.post(route('cards.store', { kanban: props.kanban_id }), {
        onSuccess: (response) => {
            card.reset();
            emit('update', props.column_id);
        },
        onError: (errors) => {
            console.log('Error creating card:', errors);
        }
    });
}
onMounted(async () => {
    const response = await axios.get(route('api.tags'));
    tags.value = response.data;
})
</script>

<template>
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

            <form @submit.prevent="createCard()" class="px-4">
                <div class="grid gap-4 py-4">
                    <div class="grid gap-2">
                        <Label for="title" class="text-sm font-medium">Title</Label>
                        <Input id="title" v-model="card.title" class="rounded-md border px-3 py-2"
                            placeholder="Enter card title" />
                        <div v-if="card.errors.title" class="text-sm text-red-500 col-span-full">
                            {{ card.errors.title }}
                        </div>
                    </div>

                    <div class="flex flex-col gap-4" v-if="clients.length > 0">
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
                                <ComboboxAnchor as-child>
                                    <TagsInput :model-value="card.tags" @update:model-value="(val) => (card.tags = val)"
                                        :class="cn('p-0 gap-0 w-full bg-input/30')">

                                        <div
                                            :class="['flex gap-2 flex-wrap items-center', card.tags.length > 0 ? 'p-2' : '']">
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

                            <span class="text-xs text-gray-500">
                                Use comma <span class="font-bold">( ,
                                    )</span> to
                                add
                            </span>
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
                    <SheetClose as-child>
                        <Button type="submit" class="cursor-pointer"> Save </Button>
                    </SheetClose>
                </SheetFooter>
            </form>
        </SheetContent>
    </Sheet>
</template>