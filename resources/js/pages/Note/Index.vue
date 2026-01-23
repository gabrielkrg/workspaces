<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { PropType, ref } from 'vue';
import type { Note } from '@/types';
import HeadingLarge from '@/components/HeadingLarge.vue';
import NotesDataTable from '@/components/NotesDataTable.vue';

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
const isEditSheetOpen = ref(false);

const selectNote = (note: Note) => {
    currentNote.value = note;

    updateForm.title = note.title;
    updateForm.content = note.content;
};

const handleEdit = (note: Note) => {
    selectNote(note);
    isEditSheetOpen.value = true;
};

const handleDelete = (noteId: number) => {
    deleteNote(noteId);
};

const updateForm = useForm({
    title: currentNote.value?.title,
    content: currentNote.value?.content,
});

const updateNote = () => {
    updateForm.put(route('notes.update', { note: currentNote.value?.id }), {
        onSuccess: () => {
            currentNote.value = null;
            isEditSheetOpen.value = false;
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

            <NotesDataTable :notes="notes || []" @edit="handleEdit" @delete="handleDelete" />

            <!-- Edit Sheet -->
            <Sheet v-model:open="isEditSheetOpen">
                <SheetContent>
                    <form @submit.prevent="updateNote()" v-if="currentNote">
                        <SheetHeader>
                            <SheetTitle> Edit note </SheetTitle>
                            <SheetDescription> Click save when you're done.
                            </SheetDescription>
                        </SheetHeader>
                        <div class="grid gap-4 p-4">
                            <div class="grid grid-cols-4 items-center gap-4">
                                <Label for="title" class="text-right"> Title </Label>
                                <Input id="title" v-model="updateForm.title" class="col-span-4" />
                                <span class="text-sm text-red-500 col-span-full" v-if="updateForm.errors.title">
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
