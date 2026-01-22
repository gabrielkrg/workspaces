<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/vue3';
import { onMounted, onUnmounted, ref } from 'vue';
import { ChromePicker } from 'vue-color';
import HeadingLarge from '@/components/HeadingLarge.vue';
import TagsDataTable from '@/components/TagsDataTable.vue';
import CreateTagSheet from '@/components/tag/CreateTagSheet.vue';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tags',
        href: '/tags',
    },
];

const props = defineProps({
    tasks: Array,
    tags: Array,
    filters: Object,
});

const activeMenu = ref(null);
const menuRef = ref(null);

const handleClickOutside = (event) => {
    if (menuRef.value && !menuRef.value.contains(event.target)) {
        activeMenu.value = null;
    }
};

const selectedTag = ref(null);
const isEditSheetOpen = ref(false);

const updateForm = useForm({
    name: '',
    color: '#68CCCA',
});

const selectTag = (tag) => {
    selectedTag.value = tag;

    updateForm.name = tag.name;
    updateForm.color = tag.color ?? '#68CCCA';
};

const handleEdit = (tag) => {
    selectTag(tag);
    isEditSheetOpen.value = true;
};

const handleDelete = (tagId) => {
    deleteTag(tagId);
};

const update = (tagId) => {
    if (selectedTag.value == null) return;

    updateForm.put(route('tags.update', tagId), {
        onSuccess: () => {
            updateForm.reset();
            selectedTag.value = null;
            isEditSheetOpen.value = false;

            router.get(route('tags.index'), {
                preserveState: true,
                replace: true,
            });
        },
    });
};

const deleteTag = (tagId) => {
    router.delete(route('tags.delete', tagId), {
        preserveScroll: true,
        onSuccess: () => {
            router.get(route('tags.index'), {
                preserveState: true,
                replace: true,
            });
        },
        onError: (errors) => {
            console.log('Erro ao deletar tag:', errors);
        },
    });
};

useForm({
    search: props.filters?.search || '',
    tag: props.filters?.tag || '',
    done: props.filters?.done || '',
});

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<template>

    <Head title="Tags" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex-1 space-y-6 md:p-8 md:pt-6 p-4 pt-2">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <HeadingLarge title="Tags" description="Here's a list of your tags!" />
                <CreateTagSheet />
            </div>

            <TagsDataTable :tags="tags || []" @edit="handleEdit" @delete="handleDelete" />

            <!-- Edit Sheet -->
            <Sheet v-model:open="isEditSheetOpen">
                <SheetContent>
                    <form @submit.prevent="update(selectedTag?.id)" v-if="selectedTag">
                        <SheetHeader>
                            <SheetTitle>Edit tag</SheetTitle>
                            <SheetDescription>Click save when you're done.</SheetDescription>
                        </SheetHeader>
                        <div class="grid gap-4 p-4">
                            <div class="grid grid-cols-4 items-center gap-4">
                                <Label for="name" class="text-right">Name</Label>
                                <Input id="name" v-model="updateForm.name" class="col-span-4" />
                                <div v-if="updateForm.errors.name" class="text-sm text-red-500 col-span-full">
                                    {{ updateForm.errors.name }}
                                </div>
                            </div>

                            <div class="grid grid-cols-4 items-center gap-4">
                                <Label for="color" class="text-right">Color</Label>
                                <ChromePicker v-model="updateForm.color" class="col-span-4" />
                            </div>
                        </div>
                        <SheetFooter>
                            <Button type="submit">Save changes</Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    </AppLayout>
</template>
