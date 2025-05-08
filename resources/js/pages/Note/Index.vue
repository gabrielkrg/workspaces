<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/vue3';
import { Pencil, Trash2 } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
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
    DialogClose
} from '@/components/ui/dialog';

import { PropType, ref } from 'vue';

interface Note {
    id?: number;
    title: string;
    content: string;
}

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
            console.log(`Note ${currentNote.value?.id} updated!`);
        },
    });
};

// delete note
const deleteNote = (noteId: number) => {
    if (noteId !== null) {
        router.delete(route('notes.delete', { note: noteId }), {
            onSuccess: () => {
                console.log(`Note ${noteId} deleted!`);
            },
        });
    }
};
</script>

<template>

    <Head title="Notes" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div class="flex flex-wrap items-end justify-between gap-4">
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
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose as-child>
                                    <Button type="submit" class="cursor-pointer"> Save </Button>
                                </DialogClose>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div class="flex gap-4 h-full">
                <div class="w-[300px]">
                    <Command class="rounded-lg border max-w-[450px]">
                        <CommandInput placeholder="Search notes..." />
                        <CommandList>
                            <CommandEmpty>No notes found.</CommandEmpty>
                            <CommandGroup class="space-y-2">
                                <CommandItem v-for="note in notes" :key="note.id" :value="note.id ?? ''"
                                    class="flex items-center justify-between">

                                    <span class="cursor-pointer font-medium" @click="selectNote(note)">
                                        {{ note.title }}
                                    </span>

                                    <div class="flex items-center gap-2">
                                        <Sheet>
                                            <SheetTrigger as-child>
                                                <SheetClose as-child>
                                                    <Button class="cursor-pointer" size="icon" @click="selectNote(note)"
                                                        title="Edit">
                                                        <Pencil class="text-white" />
                                                    </Button>
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
                                                            <Input id="title" v-model="updateForm.title"
                                                                class="col-span-4" />
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

                                        <AlertDialog>
                                            <AlertDialogTrigger as-child>
                                                <Button variant="destructive" class="cursor-pointer" size="icon"
                                                    title="Delete">
                                                    <Trash2 class="text-white" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will remove the note.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                                                    <Button variant="destructive" type="button"
                                                        @click="note.id && deleteNote(note.id)">
                                                        Delete
                                                    </Button>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

                                    </div>
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </div>

                <div v-if="currentNote" class="w-full">
                    <form @submit.prevent="updateNote" class="w-full">
                        <Textarea v-model="updateForm.content"
                            class="w-full h-[calc(100vh-200px)] overflow-y-auto resize-none" />
                        <Button type="submit" class="mt-4 cursor-pointer">Salve</Button>
                    </form>
                </div>
                <div v-else>
                    <span>Select a note or create a new one to see the details...</span>
                </div>
            </div>
        </div>
    </AppLayout>

</template>
