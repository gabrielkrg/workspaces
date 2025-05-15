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
import { Table, TableBody, TableCell, TableEmpty, TableHeader, TableRow } from '@/components/ui/table';
import TableHead from '@/components/ui/table/TableHead.vue';
import { EllipsisVertical } from 'lucide-vue-next';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PropType, ref, computed } from 'vue';

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

// Add this computed property to handle empty state
const hasNotes = computed(() => props.notes && props.notes.length > 0);
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

            <div
                class="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min p-4">
                <div v-if="hasNotes">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead class="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="note in notes" :key="note.id" class="cursor-pointer">
                                <TableCell>
                                    <div class="flex gap-2">
                                        <div class="text-gray-700 dark:text-gray-300">
                                            <h2 class="line-clamp inline-flex gap-3 text-lg font-semibold text-gray-900 dark:text-white"
                                                @click="router.visit(route('notes.show', { note: note.id }))">
                                                {{ note.title }}
                                            </h2>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Popover class="relative">
                                        <PopoverTrigger as-child>
                                            <button class="cursor-pointer p-2">
                                                <EllipsisVertical class="h-5 w-5 text-gray-900 dark:text-white" />
                                            </button>
                                        </PopoverTrigger>

                                        <PopoverContent
                                            class="bg-sidebar absolute right-5 z-50 mt-2 w-40 rounded p-0 shadow"
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
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                                                        <Button variant="destructive" type="button"
                                                            @click="note.id && deleteNote(note.id)">
                                                            Delete
                                                        </Button>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                <div v-else>
                    <Table>
                        <TableEmpty colspan="3">
                            <p class="text-gray-800 dark:text-gray-100">There are no notes yet</p>
                        </TableEmpty>
                    </Table>
                </div>
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
