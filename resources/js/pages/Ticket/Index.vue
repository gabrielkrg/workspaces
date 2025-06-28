<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import { EllipsisVertical } from 'lucide-vue-next';

// UI Components
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Badge from '@/components/ui/badge.vue';

// Sheet Components
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

// Alert Dialog Components
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';

// Popover Components
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Select Components
import Select from '@/components/ui/select/Select.vue';
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue';
import SelectValue from '@/components/ui/select/SelectValue.vue';
import SelectContent from '@/components/ui/select/SelectContent.vue';
import SelectItem from '@/components/ui/select/SelectItem.vue';

// Dialog Components
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

interface Ticket {
    id: number;
    title: string;
    description: string;
    status: 'open' | 'in_progress' | 'closed' | 'pending';
    created_at: string;
    workspace_id: number;
    user_id: number;
    client_id: number;
}

interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tickets',
        href: '/tickets',
    },
];

const props = defineProps<{
    tickets: Ticket[];
    clients: Client[];
}>();

const form = useForm({
    title: '',
    description: '',
    client_id: null as number | null,
});

const updateForm = useForm({
    title: '',
    description: '',
    status: '' as 'open' | 'in_progress' | 'closed' | 'pending',
    client_id: null as number | null,
});

const selectedTicket = ref<Ticket | null>(null);

const submit = () => {
    form.post(route('tickets.store'), {
        onSuccess: () => {
            form.reset();

            router.get(route('tickets.index'), {
                preserveState: true,
                replace: true,
            });
        },
    });
};

const selectTicket = (ticket: Ticket) => {
    selectedTicket.value = ticket;

    updateForm.title = ticket.title;
    updateForm.description = ticket.description;
    updateForm.status = ticket.status;
    updateForm.client_id = ticket.client_id;
};

const updateTicket = () => {
    if (!selectedTicket.value) return;

    updateForm.put(route('tickets.update', selectedTicket.value.id), {
        onSuccess: () => {
            selectedTicket.value = null;

            router.get(route('tickets.index'), {
                preserveState: true,
                replace: true,
            });
        },
    });
};

const deleteTicket = (id: number) => {
    updateForm.delete(route('tickets.destroy', id), {
        onSuccess: () => {
            selectedTicket.value = null;

            router.get(route('tickets.index'), {
                preserveState: true,
                replace: true,
            });
        },
    });
};
</script>

<template>

    <Head title="Tickets" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div class="flex flex-wrap items-end justify-between gap-4">
                <div></div>
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
                                    <span class="text-sm text-red-500 col-span-full" v-if="form.errors.title">
                                        {{ form.errors.title }}
                                    </span>
                                </div>

                                <div class="flex flex-col gap-4">
                                    <Label for="client_id" class="text-right"> Client
                                    </Label>
                                    <Select v-model="form.client_id" class="">
                                        <SelectTrigger id="client_id" class="w-full">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectItem v-for="client in clients" :key="client.id" :value="client.id">
                                                {{ client.name }}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <span class="text-sm text-red-500 col-span-full" v-if="form.errors.client_id">
                                        {{ form.errors.client_id }}
                                    </span>
                                </div>

                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="description" class="text-right"> Description </Label>
                                    <Textarea id="description" v-model="form.description"
                                        placeholder="Type your description here." class="col-span-4" />
                                    <span class="text-sm text-red-500 col-span-full" v-if="form.errors.description">
                                        {{ form.errors.description }}
                                    </span>
                                </div>
                            </div>
                            <SheetFooter>
                                <Button type="submit" class="cursor-pointer"> Save </Button>
                            </SheetFooter>
                        </form>
                    </SheetContent>
                </Sheet>
            </div>

            <div class="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min p-4"
                v-if="tickets.length > 0">
                <div v-for="ticket in tickets" :key="ticket.id" class="group flex items-start gap-4 border-b p-4">


                    <!-- Title, Description, Status, Created At -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                                {{ ticket.title }}
                            </h2>
                            <div class="flex items-center gap-1 flex-wrap">
                                <div class="flex items-start pt-1">
                                    <div
                                        class="flex rounded bg-green-700 px-1 text-xs font-normal text-white capitalize">
                                        {{ ticket.status }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p class="mt-1 text-gray-700 dark:text-gray-300 break-words">{{ ticket.description }}
                        </p>
                        <span class="text-sm text-muted-foreground">
                            {{ new Date(ticket.created_at).toLocaleDateString() }}
                        </span>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-start justify-end">
                        <Popover>
                            <PopoverTrigger as-child>
                                <button class="cursor-pointer p-2">
                                    <EllipsisVertical class="h-5 w-5 text-gray-900 dark:text-white" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent class="bg-sidebar absolute right-5 z-50 mt-2 w-40 rounded p-0 shadow"
                                align="end">
                                <Sheet>
                                    <SheetTrigger as-child>
                                        <div @click="selectTicket(ticket)"
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
                                                    <Label for="update-title" class="text-right">Title</Label>
                                                    <Input id="update-title" v-model="updateForm.title"
                                                        class="col-span-4" />
                                                    <span class="text-sm text-red-500 col-span-full"
                                                        v-if="updateForm.errors.title">
                                                        {{ updateForm.errors.title }}
                                                    </span>

                                                </div>

                                                <div class="flex flex-col gap-4">
                                                    <Label for="update-client_id" class="text-right">Client</Label>
                                                    <Select v-model="updateForm.client_id" class="">
                                                        <SelectTrigger id="client_id" class="w-full">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent position="popper">
                                                            <SelectItem v-for="client in clients" :key="client.id"
                                                                :value="client.id">
                                                                {{ client.name }}
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <span class="text-sm text-red-500 col-span-full"
                                                        v-if="updateForm.errors.client_id">
                                                        {{ updateForm.errors.client_id }}
                                                    </span>
                                                </div>

                                                <div class="flex flex-col gap-4">
                                                    <Label for="update-status" class="text-right">Status</Label>
                                                    <Select v-model="updateForm.status" class="">
                                                        <SelectTrigger id="status" class="w-full">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent position="popper">
                                                            <SelectItem value="open">Open</SelectItem>
                                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                                            <SelectItem value="closed">Closed</SelectItem>
                                                            <SelectItem value="pending">Pending</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <span class="text-sm text-red-500 col-span-full"
                                                        v-if="updateForm.errors.status">
                                                        {{ updateForm.errors.status }}
                                                    </span>
                                                </div>

                                                <div class="grid grid-cols-4 items-center gap-4">
                                                    <Label for="update-description"
                                                        class="text-right">Description</Label>
                                                    <Textarea id="update-description" v-model="updateForm.description"
                                                        class="col-span-4" />
                                                    <span class="text-sm text-red-500 col-span-full"
                                                        v-if="updateForm.errors.description">
                                                        {{ updateForm.errors.description }}
                                                    </span>
                                                </div>

                                            </div>

                                            <div class="flex justify-end gap-2">
                                                <DialogClose as-child>
                                                    <Button variant="outline" class="cursor-pointer"
                                                        type="button">Cancel</Button>
                                                </DialogClose>

                                                <Button type="submit" class="cursor-pointer">Save Changes</Button>
                                            </div>
                                        </form>
                                    </SheetContent>
                                </Sheet>

                                <Dialog>
                                    <DialogTrigger as-child>
                                        <div class="block w-full cursor-pointer px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                                            variant="destructive">
                                            Delete
                                        </div>
                                    </DialogTrigger>

                                    <DialogContent class="space-y-6">
                                        <DialogHeader class="space-y-3">
                                            <DialogTitle>Are you sure you want to delete this ticket?
                                            </DialogTitle>
                                            <DialogDescription>
                                                Once your ticket is deleted, there's no way to recover it.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <DialogFooter class="gap-2">
                                            <DialogClose as-child>
                                                <Button variant="secondary" class="cursor-pointer"
                                                    type="button">Cancel</Button>
                                            </DialogClose>

                                            <Button variant="destructive" class="cursor-pointer" type="button"
                                                @click="deleteTicket(ticket.id)">
                                                Delete ticket
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>
            <div v-else class="flex h-32 items-center justify-center rounded-lg border">
                <p class="text-gray-800 dark:text-gray-100">There are no tickets yet</p>
            </div>
        </div>
    </AppLayout>
</template>
