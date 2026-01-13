<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm, router } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import {
    Combobox,
    ComboboxAnchor,
    ComboboxInput,
    ComboboxList,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxItem,
} from '@/components/ui/combobox';
import {
    TagsInput,
    TagsInputInput,
    TagsInputItem,
    TagsInputItemDelete,
    TagsInputItemText
} from '@/components/ui/tags-input';
import { cn } from '@/lib/utils';
import { useFilter } from 'reka-ui';

const props = defineProps<{
    clients: any[],
    tags: { name: string, color: string }[]
}>();

const form = useForm({
    title: '',
    description: '',
    client_id: null,
    repeat: 'none',
    tags: [] as string[],
    delete_after: false,
});

const openSearchTerm = ref(false);
const searchTerm = ref('');
const { contains } = useFilter({ sensitivity: 'base' });

const filteredTags = computed(() => {
    const options = props.tags.filter(i => !form.tags.includes(i.name));
    return searchTerm.value ? options.filter(option => contains(option.name, searchTerm.value)) : options;
});

const submit = () => {
    form.post(route('tasks.store'), {
        onSuccess: () => {
            form.reset();
            router.get(route('tasks.index'), {
                preserveState: true,
                replace: true,
            });
        },
    });
};
</script>

<template>
    <Sheet>
        <SheetTrigger as-child>
            <Button variant="default" class="cursor-pointer"> Create </Button>
        </SheetTrigger>
        <SheetContent :class="cn('overflow-y-auto')">
            <form @submit.prevent="submit">
                <SheetHeader>
                    <SheetTitle>Create task</SheetTitle>
                    <SheetDescription> Fill the fields to create a new task. Click save when you're done.
                    </SheetDescription>
                </SheetHeader>
                <div class="grid gap-4 p-4">
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="title" class="text-right"> Title </Label>
                        <Input id="title" v-model="form.title" class="col-span-4" />
                        <div v-if="form.errors.title" class="text-sm text-red-500 col-span-full">
                            {{ form.errors.title }}
                        </div>
                    </div>

                    <div class="flex flex-col gap-4">
                        <Label for="client" class="text-right"> Client </Label>
                        <Select v-model="form.client_id">
                            <SelectTrigger id="client" class="w-full">
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
                        <Label for="repeat" class="text-right"> Repeat </Label>
                        <Select v-model="form.repeat" class="">
                            <SelectTrigger id="repeat" class="w-full">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem value="none"> Never </SelectItem>
                                <SelectItem value="daily"> Daily </SelectItem>
                                <SelectItem value="weekly"> Weekly </SelectItem>
                                <SelectItem value="monthly"> Monthly </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="flex flex-col gap-4">
                        <Label for="tags" class="text-right"> Tags </Label>
                        <div>
                            <Combobox v-model="form.tags" v-model:open="openSearchTerm" :ignore-filter="true">
                                <ComboboxAnchor as-child :class="cn('dark:bg-input/30')">
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

                            <span class="text-xs text-gray-500"> Use comma <span class="font-bold">( ,
                                    )</span> to add </span>
                        </div>

                        <div v-if="form.errors.tags" class="text-sm text-red-500">
                            {{ form.errors.tags }}
                        </div>
                    </div>


                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="description" class="text-right"> Description </Label>
                        <Textarea id="description" v-model="form.description" placeholder="Type your description here."
                            class="col-span-4" />
                    </div>

                    <div class="items-top flex gap-x-2">
                        <Checkbox id="delete" v-model="form.delete_after" />
                        <div class="grid gap-1.5 leading-none">
                            <label for="delete"
                                class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Delete after conclusion
                            </label>
                            <p class="text-muted-foreground text-sm">
                                Be careful, if checked this tasks will be automatically deleted after
                                conclusion.
                            </p>
                        </div>
                    </div>
                </div>

                <SheetFooter>
                    <div class="flex justify-end gap-2">
                        <SheetClose asChild>
                            <Button variant="outline" type="button" class="cursor-pointer">Cancel</Button>
                        </SheetClose>

                        <Button type="submit" :disabled="form.processing" class="cursor-pointer">Save</Button>
                    </div>
                </SheetFooter>
            </form>
        </SheetContent>
    </Sheet>
</template>
