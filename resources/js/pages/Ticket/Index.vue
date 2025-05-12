<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { ref } from 'vue';

import { useForm } from '@inertiajs/vue3';
import Badge from '@/components/ui/badge.vue';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Ticket {
    id: number;
    title: string;
    description: string;
    status: 'open' | 'in_progress' | 'closed' | 'pending';
    created_at: string;
    workspace_id: number;
    user_id: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tickets',
        href: '/tickets',
    },
];

const props = defineProps<{
    tickets: Ticket[];
}>();

const form = useForm({
    title: '',
    description: '',
});

const updateForm = useForm({
    title: '',
    description: '',
    status: '',
});

const selectedTicket = ref<Ticket | null>(null);
const showSheet = ref(false);
const showDeleteDialog = ref(false);

const submit = () => {
    form.post(route('tickets.store'), {
        onSuccess: () => form.reset(),
    });
};

const getStatusColor = (status: Ticket['status']): string => {
    const colors: Record<Ticket['status'], string> = {
        'open': 'bg-green-500',
        'in_progress': 'bg-yellow-500',
        'closed': 'bg-gray-500',
        'pending': 'bg-blue-500'
    };
    return colors[status] || 'bg-gray-500';
};

const updateTicket = () => {
    if (!selectedTicket.value) return;

    updateForm.put(route('tickets.update', selectedTicket.value.id), {
        onSuccess: () => {
            showSheet.value = false;
            selectedTicket.value = null;
        },
    });
};

const deleteTicket = () => {
    if (!selectedTicket.value) return;

    updateForm.delete(route('tickets.destroy', selectedTicket.value.id), {
        onSuccess: () => {
            showSheet.value = false;
            selectedTicket.value = null;
            showDeleteDialog.value = false;
        },
    });
};

const openTicketSheet = (ticket: Ticket) => {
    selectedTicket.value = ticket;
    updateForm.title = ticket.title;
    updateForm.description = ticket.description;
    updateForm.status = ticket.status;
    showSheet.value = true;
};
const closeTicketSheet = () => {
    showSheet.value = false;
    selectedTicket.value = null;
};
</script>

<template>

    <Head title="Tickets" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div>
                <Sheet>
                    <SheetTrigger as-child>
                        <Button variant="default" class="cursor-pointer"> Create </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <form @submit.prevent="submit">
                            <SheetHeader>
                                <SheetTitle>Create ticket</SheetTitle>
                                <SheetDescription> Fill the fields to create a new ticket. Click save when you're done.
                                </SheetDescription>
                            </SheetHeader>
                            <div class="grid gap-4 p-4">
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="title" class="text-right"> Title </Label>
                                    <Input id="title" v-model="form.title" class="col-span-4" />
                                </div>

                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="description" class="text-right"> Description </Label>
                                    <Textarea id="description" v-model="form.description"
                                        placeholder="Type your description here." class="col-span-4" />
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

            <div
                class="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min">
                <div class="p-4">
                    <div class="grid gap-4">
                        <div v-for="ticket in tickets" :key="ticket.id"
                            class="bg-card hover:bg-accent/50 cursor-pointer transition-all duration-200 rounded-lg border p-4 shadow-sm"
                            @click="openTicketSheet(ticket)">
                            <div class="flex items-start justify-between">
                                <div class="space-y-1">
                                    <div class="flex items-center gap-2">
                                        <span class="font-mono text-sm text-muted-foreground">#{{ ticket.id }}</span>
                                        <h3 class="font-medium">{{ ticket.title }}</h3>
                                    </div>
                                    <p class="text-sm text-muted-foreground line-clamp-2">{{ ticket.description }}</p>
                                </div>
                                <Badge :class="getStatusColor(ticket.status)" class="text-white">
                                    {{ ticket.status }}
                                </Badge>
                            </div>
                            <div class="mt-4 flex items-center justify-between">
                                <span class="text-sm text-muted-foreground">
                                    Created {{ new Date(ticket.created_at).toLocaleDateString() }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Sheet v-model:open="showSheet">
                        <SheetContent side="right" class="sm:max-w-[500px]">
                            <SheetHeader v-if="selectedTicket">
                                <SheetTitle>Edit Ticket</SheetTitle>
                                <SheetDescription>Update ticket details</SheetDescription>
                            </SheetHeader>
                            <form v-if="selectedTicket" @submit.prevent="updateTicket" class="space-y-4 mt-4 p-4">
                                <div class="grid gap-4">
                                    <div class="grid grid-cols-4 items-center gap-4">
                                        <Label for="update-title" class="text-right">Title</Label>
                                        <Input id="update-title" v-model="updateForm.title" class="col-span-3" />
                                    </div>

                                    <div class="grid grid-cols-4 items-center gap-4">
                                        <Label for="update-description" class="text-right">Description</Label>
                                        <Textarea id="update-description" v-model="updateForm.description"
                                            class="col-span-3" />
                                    </div>

                                    <div class="grid grid-cols-4 items-center gap-4">
                                        <Label for="update-status" class="text-right">Status</Label>
                                        <select id="update-status" v-model="updateForm.status"
                                            class="col-span-3 rounded-md border border-input bg-background px-3 py-2">
                                            <option value="open">Open</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="closed">Closed</option>
                                            <option value="pending">Pending</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="flex justify-between items-center mt-6">
                                    <AlertDialog v-model:open="showDeleteDialog">
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive">Delete Ticket</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the
                                                    ticket.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <Button variant="destructive" @click="deleteTicket">Delete</Button>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                    <div class="flex gap-2">
                                        <SheetClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </SheetClose>
                                        <Button type="submit">Save Changes</Button>
                                    </div>
                                </div>
                            </form>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
