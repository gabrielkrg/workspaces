<script setup lang="ts">
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox, ComboboxAnchor, ComboboxInput, ComboboxList, ComboboxEmpty, ComboboxGroup, ComboboxItem } from '@/components/ui/combobox';
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input';
import { cn } from '@/lib/utils';
import { type Task, type Tag } from '@/types';
import { Pencil } from 'lucide-vue-next';
import { router, useForm } from '@inertiajs/vue3';
import { useFilter } from 'reka-ui';
import { computed, onMounted, ref } from 'vue';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import axios from 'axios';

const props = defineProps<{
    task: Task;
}>();

const tags = ref<Tag[]>([]);
const isOpen = ref(false);

const emit = defineEmits(['update']);

const openSearchTerm = ref(false)
const searchTerm = ref('')

const { contains } = useFilter({ sensitivity: 'base' })

const filteredTags = computed(() => {
    const options = tags.value.filter(i => !updateForm.tags.includes(i.name))
    return searchTerm.value ? options.filter(option => contains(option.name, searchTerm.value)) : options
})

const updateForm = useForm({
    title: props.task.title,
    repeat: props.task.repeat,
    tags: props.task.tags?.map((tag: Tag) => tag.name) || [],
    client_id: props.task.client_id,
    description: props.task.description,
    delete_after: props.task.delete_after,
});

const update = (task: Task) => {
    updateForm.put(route('tasks.update', task.id), {
        onSuccess: () => {
            isOpen.value = false;
            updateForm.reset();
            emit('update');
        },
        onError: (errors) => {
            console.log('Error updating task:', errors);
        },
    });
};

onMounted(async () => {
    const response = await axios.get(route('api.tags'));
    tags.value = response.data;

    updateForm.tags = props.task.tags?.map((tag: Tag) => tag.name) || [];
})

</script>

<template>
    <Sheet v-model:open="isOpen" :modal="false">
        <SheetTrigger as-child>
            <Button variant="secondary" size="icon">
                <Pencil />
            </Button>
        </SheetTrigger>
        <SheetContent :class="cn('overflow-y-auto')">
            <form @submit.prevent="update(task)">
                <SheetHeader>
                    <SheetTitle> Edit task </SheetTitle>
                    <SheetDescription> Click save when you're done.
                    </SheetDescription>
                </SheetHeader>
                <div class="grid gap-4 p-4">
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="title" class="text-right"> Title
                        </Label>
                        <Input id="title" v-model="updateForm.title" class="col-span-4" />
                        <div v-if="updateForm.errors.title" class="text-sm text-red-500 col-span-full">
                            {{ updateForm.errors.title }}
                        </div>
                    </div>

                    <!-- 
                    <div class="flex flex-col gap-4">
                        <Label for="title" class="text-right"> Client
                        </Label>
                        <Select v-model="updateForm.client_id" class="">
                            <SelectTrigger id="role" class="w-full">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem v-for="client in clients" :key="client.id" :value="client.id">
                                    {{ client.name }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div> -->

                    <div class="flex flex-col gap-4">
                        <Label for="title" class="text-right"> Repeat
                        </Label>
                        <Select v-model="updateForm.repeat" class="">
                            <SelectTrigger id="role" class="w-full">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem value="none"> Never
                                </SelectItem>
                                <SelectItem value="daily"> Daily
                                </SelectItem>
                                <SelectItem value="weekly"> Weekly
                                </SelectItem>
                                <SelectItem value="monthly"> Monthly
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="flex flex-col gap-4">
                        <Label for="title" class="text-right"> Tags </Label>
                        <div>
                            <Combobox v-model="updateForm.tags" v-model:open="openSearchTerm" :ignore-filter="true">
                                <ComboboxAnchor as-child>
                                    <TagsInput :model-value="updateForm.tags"
                                        @update:model-value="(val) => (updateForm.tags = val)"
                                        :class="cn('p-0 gap-0 w-full bg-input/30')">

                                        <div
                                            :class="['flex gap-2 flex-wrap items-center', updateForm.tags.length > 0 ? 'p-2' : '']">
                                            <TagsInputItem v-for="tag in updateForm.tags" :key="tag" :value="tag">
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
                                                        updateForm.tags.push(ev.detail.value)
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

                        <div v-if="updateForm.errors.tags" class="text-sm text-red-500">
                            {{ updateForm.errors.tags }}
                        </div>
                    </div>

                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="description" class="text-right">
                            Description
                        </Label>
                        <Textarea id="description" v-model="updateForm.description" class="col-span-4" />
                    </div>

                    <div class="items-top flex gap-x-2">
                        <Checkbox id="delete2" v-model="updateForm.delete_after" />
                        <div class="grid gap-1.5 leading-none">
                            <label for="delete2"
                                class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Delete after conclusion
                            </label>
                            <p class="text-muted-foreground text-sm">
                                Be careful, if checked this tasks will be
                                automatically deleted after conclusion.
                            </p>
                        </div>
                    </div>
                </div>
                <SheetFooter>
                    <div class="flex justify-end gap-2">
                        <SheetClose asChild>
                            <Button variant="outline" type="button" class="cursor-pointer">Cancel</Button>

                            <Button type="submit" :disabled="updateForm.processing" class="cursor-pointer">Save</Button>
                        </SheetClose>
                    </div>
                </SheetFooter>
            </form>
        </SheetContent>
    </Sheet>
</template>