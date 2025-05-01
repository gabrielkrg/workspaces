<script setup lang="ts">
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/vue3';
import { EllipsisVertical } from 'lucide-vue-next';
import { onMounted, onUnmounted, ref } from 'vue';
import { ChromePicker } from 'vue-color';

const color = defineModel({
    default: '#68CCCA',
});

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Daily Tasks',
        href: '/tasks',
    },
];

const props = defineProps({
    tasks: Array,
    tags: Array,
    filters: Object,
});

const form = useForm({
    name: '',
    color: '#68CCCA',
});

const submit = () => {
    form.post(route('tags.store'), {
        onSuccess: () => {
            form.reset();
        },
    });
};

const activeMenu = ref(null);
const menuRef = ref(null);

const handleClickOutside = (event) => {
    if (menuRef.value && !menuRef.value.contains(event.target)) {
        activeMenu.value = null;
    }
};

const selectedTag = ref(null);

const updateForm = useForm({
    name: '',
    color: '#68CCCA',
});

const selectTag = (tag) => {
    selectedTag.value = tag;

    updateForm.name = tag.name;
    updateForm.color = tag.color ?? '#68CCCA';
};

const update = (tagId) => {
    if (selectedTag.value == null) return;

    updateForm.put(route('tags.update', tagId), {
        onSuccess: () => {
            updateForm.reset();
        },
    });
};

const closeModal = () => {};
const deleteTag = (tagId) => {
    router.delete(route('tags.delete', tagId), {
        preserveScroll: true,
        onSuccess: () => closeModal(),
        onError: (errors) => {
            console.log('Erro ao deletar tag:', errors);
        },
    });
};

const filtersForm = useForm({
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
    <Head title="Daily Tasks" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div class="flex flex-wrap items-end justify-between gap-4">
                <Sheet>
                    <SheetTrigger as-child>
                        <Button variant="default" class="cursor-pointer"> Create </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <form @submit.prevent="submit">
                            <SheetHeader>
                                <SheetTitle>Create tag</SheetTitle>
                                <SheetDescription> Fill the fields to create a new tag. Click save when you're done. </SheetDescription>
                            </SheetHeader>
                            <div class="grid gap-4 p-4">
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="name" class="text-right"> Name </Label>
                                    <Input id="name" v-model="form.name" class="col-span-4" />
                                </div>
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="color" class="text-right"> Color </Label>

                                    <ChromePicker v-model="form.color" class="col-span-4" />
                                </div>
                            </div>
                            <SheetFooter>
                                <SheetClose as-child>
                                    <Button type="submit" class="cursor-pointer"> Save </Button>
                                </SheetClose>
                            </SheetFooter>
                        </form>
                    </SheetContent>
                </Sheet>
            </div>

            <div class="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min">
                <div class="p-5">
                    <!-- tags -->
                    <div v-if="tags.length > 0">
                        <ul class="space-y-2 divide-y">
                            <li v-for="tag in tags" :key="tag.id" class="flex flex-row items-center justify-between gap-4 p-4">
                                <div class="flex items-start gap-4">
                                    <div class="flex flex-wrap gap-3">
                                        <h2 class="line-clamp inline-flex gap-3 text-lg font-semibold text-gray-900 dark:text-white">
                                            {{ tag.name }}
                                        </h2>
                                    </div>
                                </div>

                                <Popover class="relative">
                                    <PopoverTrigger as-child>
                                        <button class="cursor-pointer p-2">
                                            <EllipsisVertical class="m-5 h-5 w-5 text-gray-900 dark:text-white" />
                                        </button>
                                    </PopoverTrigger>

                                    <PopoverContent class="bg-sidebar absolute right-5 z-50 mt-2 w-40 rounded p-0 shadow" align="end">
                                        <Sheet>
                                            <SheetTrigger as-child>
                                                <div
                                                    @click="selectTag(tag)"
                                                    class="dark:hover:bg-muted block w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100"
                                                >
                                                    Edit
                                                </div>
                                            </SheetTrigger>
                                            <SheetContent>
                                                <form @submit.prevent="update(tag)">
                                                    <SheetHeader>
                                                        <SheetTitle> Edit tag </SheetTitle>
                                                        <SheetDescription> Click save when you're done. </SheetDescription>
                                                    </SheetHeader>
                                                    <div class="grid gap-4 p-4">
                                                        <div class="grid grid-cols-4 items-center gap-4">
                                                            <Label for="name" class="text-right"> Name </Label>
                                                            <Input id="name" v-model="updateForm.name" class="col-span-4" />
                                                        </div>

                                                        <div class="grid grid-cols-4 items-center gap-4">
                                                            <Label for="color" class="text-right"> Color </Label>

                                                            <ChromePicker v-model="updateForm.color" class="col-span-4" />
                                                        </div>
                                                    </div>
                                                    <SheetFooter>
                                                        <SheetClose as-child>
                                                            <Button type="submit"> Save changes </Button>
                                                        </SheetClose>
                                                    </SheetFooter>
                                                </form>
                                            </SheetContent>
                                        </Sheet>
                                        <Dialog>
                                            <DialogTrigger as-child>
                                                <div
                                                    class="block w-full cursor-pointer px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                                                    variant="destructive"
                                                >
                                                    Delete
                                                </div>
                                            </DialogTrigger>

                                            <DialogContent>
                                                <form class="space-y-6" @submit.prevent="deleteTag(tag.id)">
                                                    <DialogHeader class="space-y-3">
                                                        <DialogTitle>Are you sure you want to delete this tag?</DialogTitle>
                                                        <DialogDescription>
                                                            Once your tag is deleted, there’s no way to recover it.
                                                        </DialogDescription>
                                                    </DialogHeader>

                                                    <DialogFooter class="gap-2">
                                                        <DialogClose as-child>
                                                            <Button variant="secondary">Cancel</Button>
                                                        </DialogClose>

                                                        <Button variant="destructive" :disabled="form.processing">
                                                            <button type="submit">Delete tag</button>
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </PopoverContent>
                                </Popover>
                            </li>
                        </ul>
                    </div>
                    <div v-else>
                        <p class="text-gray-800 dark:text-gray-100">There are no tasks yet</p>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
