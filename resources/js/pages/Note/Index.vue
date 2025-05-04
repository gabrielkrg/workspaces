<script setup lang="ts">
import { Button } from '@/components/ui/button';
import CommandEmpty from '@/components/ui/command/CommandEmpty.vue';
import CommandGroup from '@/components/ui/command/CommandGroup.vue';
import CommandInput from '@/components/ui/command/CommandInput.vue';
import CommandItem from '@/components/ui/command/CommandItem.vue';
import CommandList from '@/components/ui/command/CommandList.vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/vue3';
import Command from '@/components/ui/command/Command.vue';
import { Trash2 } from 'lucide-vue-next';
import { ref } from 'vue';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notes',
        href: '/notes',
    },
];

const props = defineProps({
    notes: Array,
    currentNote: Object, // ou Note | null
});

const form = useForm({
    title: '',
});

const showDeleteDialog = ref(false);
const noteIdToDelete = ref<number | null>(null);

const submit = () => {
    form.post(route('notes.store'), {
        onSuccess: () => {
            form.reset();
        },
    });
};

const selectNote = (noteId: number) => {
    router.get(route('notes.index', { note: noteId }));
};

const updateNote = () => {
    router.put(route('notes.update', { note: props.currentNote.id }), {
        title: props.currentNote.title,
        content: props.currentNote.content,
    }, {
        onSuccess: () => {
            console.log(`Note ${props.currentNote.id} updated!`);
        },
    });
};

const openDeleteDialog = (id: number) => {
    noteIdToDelete.value = id;
    showDeleteDialog.value = true;
};

const confirmDelete = () => {
    if (noteIdToDelete.value !== null) {
        router.delete(route('notes.delete', { note: noteIdToDelete.value }), {
            onSuccess: () => {
                showDeleteDialog.value = false;
                noteIdToDelete.value = null;
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
                                <CommandItem v-for="note in notes" :key="note.id" :value="note.id" :class="[
                                    'cursor-pointer flex items-center justify-between',
                                    currentNote && note.id === currentNote.id ? 'bg-accent text-accent-foreground' : ''
                                ]" @click="selectNote(note.id)">
                                    <span>{{ note.title }}</span>
                                    <button class="ml-2 text-red-500 hover:text-red-700"
                                        @click.stop="openDeleteDialog(note.id)" title="Delete">
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </div>

                <div v-if="currentNote" class="w-full">
                    <form @submit.prevent="updateNote" class="w-full">
                        <Textarea v-model="currentNote.content"
                            class="w-full h-[calc(100vh-200px)] overflow-y-auto resize-none" />
                        <Button type="submit" class="mt-4">Salve</Button>
                    </form>
                </div>
                <div v-else>
                    <span>Select a note or create a new one to see the details...</span>
                </div>
            </div>
        </div>
    </AppLayout>

    <AlertDialog v-model:open="showDeleteDialog">
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Delete note</AlertDialogTitle>
                <AlertDialogDescription>
                    Are you sure you want to delete this note? This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel @click="showDeleteDialog = false">Cancel</AlertDialogCancel>
                <AlertDialogAction @click="confirmDelete">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>
