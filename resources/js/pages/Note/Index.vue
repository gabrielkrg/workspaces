<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { EllipsisVertical } from 'lucide-vue-next';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PropType, ref, computed } from 'vue';
import type { Note } from '@/types';
import HeadingLarge from '@/components/HeadingLarge.vue';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notes',
        href: '/notes',
    },
];

const props = defineProps({
    notes: Array as PropType<Note[]>,
    currentNote: Object,
});

const form = useForm({
    title: '',
});

const submit = () => {
    form.post(route('notes.store'), {
        onSuccess: () => {
            form.reset();
        },
    });
};

// update note
const currentNote = ref(props.currentNote);

const selectNote = (note: Note) => {
    currentNote.value = note;

    updateForm.title = note.title;
    updateForm.content = note.content;
};

const updateForm = useForm({
    title: currentNote.value?.title,
    content: currentNote.value?.content,
});

const updateNote = () => {
    updateForm.put(route('notes.update', { note: currentNote.value?.id }), {
        onSuccess: () => {
            router.get(route('notes.index'), {
                preserveState: true,
                replace: true,
            });
        },
    });
};

// delete note
const deleteNote = (noteId: number) => {
    if (noteId !== null) {
        router.delete(route('notes.delete', { note: noteId }), {
            onSuccess: () => {
                // router.get(route('notes.index'), {
                //     preserveState: true,
                //     replace: true,
                // });
            },
        });
    }
};

// Add this computed property to handle empty state
const hasNotes = computed(() => props.notes && props.notes.length > 0);
</script>

<template>

    <Head title="Notes" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex-1 space-y-6 md:p-8 md:pt-6 p-4 pt-2">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <HeadingLarge title="Notes" description="Here's a list of your notes!" />
                <Dialog>
                    <DialogTrigger as-child>
                        <Button variant="default" class="cursor-pointer"> Create </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form @submit.prevent="submit">
                            <DialogHeader>
                                <DialogTitle>Create note</DialogTitle>
                                <DialogDescription>
                                    Fill the fields to create a new task. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div class="grid gap-4 py-4">
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="title" class="text-right"> Title </Label>
                                    <Input id="title" v-model="form.title" class="col-span-4" />
                                    <span class="text-sm text-red-500 col-span-full" v-if="form.errors.title">
                                        {{ form.errors.title }}
                                    </span>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" class="cursor-pointer"> Save </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div class="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min p-4"
                v-if="hasNotes">
                <div v-for="note in notes" :key="note.id" class="group flex items-start gap-4 border-b p-4">
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                            <h2 class="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer"
                                @click="router.visit(route('notes.show', { note: note.id }))">
                                {{ note.title }}
                            </h2>
                        </div>
                    </div>

                    <div class="flex items-start justify-end">
                        <Popover class="relative">
                            <PopoverTrigger as-child>
                                <button class="cursor-pointer p-2">
                                    <EllipsisVertical class="h-5 w-5 text-gray-900 dark:text-white" />
                                </button>
                            </PopoverTrigger>

                            <PopoverContent class="bg-sidebar absolute right-5 z-50 mt-2 w-40 rounded p-0 shadow"
                                align="end">
                                <Sheet>
                                    <SheetTrigger as-child>
                                        <SheetClose as-child>
                                            <div @click="selectNote(note)"
                                                class="dark:hover:bg-muted block w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100">
                                                Edit
                                            </div>
                                        </SheetClose>
                                    </SheetTrigger>
                                    <SheetContent>
                                        <form @submit.prevent="updateNote()">
                                            <SheetHeader>
                                                <SheetTitle> Edit note </SheetTitle>
                                                <SheetDescription> Click save when you're done.
                                                </SheetDescription>
                                            </SheetHeader>
                                            <div class="grid gap-4 p-4">
                                                <div class="grid grid-cols-4 items-center gap-4">
                                                    <Label for="title" class="text-right"> Title </Label>
                                                    <Input id="title" v-model="updateForm.title" class="col-span-4" />
                                                    <span class="text-sm text-red-500 col-span-full"
                                                        v-if="updateForm.errors.title">
                                                        {{ updateForm.errors.title }}
                                                    </span>
                                                </div>
                                            </div>
                                            <SheetFooter>
                                                <Button type="submit"> Save changes </Button>
                                            </SheetFooter>
                                        </form>
                                    </SheetContent>
                                </Sheet>

                                <Button variant="ghost"
                                    class="block w-full cursor-pointer px-4 py-2 text-left text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-none"
                                    @click="router.visit(route('notes.show', { note: note.id }))">
                                    View
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger as-child>
                                        <div
                                            class="block w-full cursor-pointer px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900">
                                            Delete
                                        </div>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will remove the note.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel class="cursor-pointer">Cancel</AlertDialogCancel>

                                            <Button variant="destructive" type="button" class="cursor-pointer"
                                                @click="note.id && deleteNote(note.id)">
                                                Delete
                                            </Button>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>
            <div v-else class="flex h-32 items-center justify-center rounded-lg border">
                <p class="text-gray-800 dark:text-gray-100">There are no notes yet</p>
            </div>
        </div>
    </AppLayout>
</template>

<style scoped>
.line-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
