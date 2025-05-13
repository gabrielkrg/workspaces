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
import { Table, TableBody, TableCell, TableEmpty, TableHeader, TableRow } from '@/components/ui/table';
import TableHead from '@/components/ui/table/TableHead.vue';
import { EllipsisVertical } from 'lucide-vue-next';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
            <div class="flex flex-wrap items-end justify-between gap-4">
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
                class="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min p-4">
                <div v-if="tickets.length > 0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead class="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="ticket in tickets" :key="ticket.id">
                                <TableCell>
                                    <span class="font-mono text-sm text-muted-foreground">#{{ ticket.id }}</span>
                                </TableCell>
                                <TableCell>
                                    <h3 class="font-medium">{{ ticket.title }}</h3>
                                </TableCell>
                                <TableCell>
                                    <p class="text-sm text-muted-foreground line-clamp-2">{{ ticket.description }}</p>
                                </TableCell>
                                <TableCell>
                                    <Badge :class="getStatusColor(ticket.status)" class="text-white">
                                        {{ ticket.status }}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <span class="text-sm text-muted-foreground">
                                        {{ new Date(ticket.created_at).toLocaleDateString() }}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Popover>
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
                                                    <div @click="openTicketSheet(ticket)"
                                                        class="dark:hover:bg-muted block w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100">
                                                        Edit
                                                    </div>
                                                </SheetTrigger>
                                                <SheetContent side="right" class="sm:max-w-[500px]">
                                                    <SheetHeader>
                                                        <SheetTitle>Edit Ticket</SheetTitle>
                                                        <SheetDescription>Update ticket details</SheetDescription>
                                                    </SheetHeader>
                                                    <form v-if="selectedTicket" @submit.prevent="updateTicket"
                                                        class="space-y-4 mt-4 p-4">
                                                        <div class="grid gap-4">
                                                            <div class="grid grid-cols-4 items-center gap-4">
                                                                <Label for="update-title"
                                                                    class="text-right">Title</Label>
                                                                <Input id="update-title" v-model="updateForm.title"
                                                                    class="col-span-3" />
                                                            </div>

                                                            <div class="grid grid-cols-4 items-center gap-4">
                                                                <Label for="update-description"
                                                                    class="text-right">Description</Label>
                                                                <Textarea id="update-description"
                                                                    v-model="updateForm.description"
                                                                    class="col-span-3" />
                                                            </div>

                                                            <div class="grid grid-cols-4 items-center gap-4">
                                                                <Label for="update-status"
                                                                    class="text-right">Status</Label>
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
                                                                <AlertDialogTrigger as-child>
                                                                    <Button variant="destructive">Delete Ticket</Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Are you sure?
                                                                        </AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            This action cannot be undone. This will
                                                                            permanently delete the
                                                                            ticket.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                        <Button variant="destructive"
                                                                            @click="deleteTicket">Delete</Button>
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
                                            <AlertDialog v-model:open="showDeleteDialog">
                                                <AlertDialogTrigger as-child>
                                                    <div
                                                        class="block w-full cursor-pointer px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900">
                                                        Delete
                                                    </div>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete
                                                            the
                                                            ticket.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <Button variant="destructive"
                                                            @click="deleteTicket">Delete</Button>
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
                        <TableEmpty colspan="6">
                            <p class="text-gray-800 dark:text-gray-100">There are no tickets yet</p>
                        </TableEmpty>
                    </Table>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
