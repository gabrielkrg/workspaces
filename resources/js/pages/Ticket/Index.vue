<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';

// UI Components
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Sheet Components
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet';

// Popover Components
import HeadingLarge from '@/components/HeadingLarge.vue';
import TicketsDataTable from '@/components/TicketsDataTable.vue';

// Select Components
import Select from '@/components/ui/select/Select.vue';
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue';
import SelectValue from '@/components/ui/select/SelectValue.vue';
import SelectContent from '@/components/ui/select/SelectContent.vue';
import SelectItem from '@/components/ui/select/SelectItem.vue';

import type { Ticket, Client } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tickets',
        href: '/tickets',
    },
];

defineProps<{
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
const isEditSheetOpen = ref(false);

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

const handleEdit = (ticket: Ticket) => {
    selectTicket(ticket);
    isEditSheetOpen.value = true;
};

const handleDelete = (ticketId: number) => {
    deleteTicket(ticketId);
};

const updateTicket = () => {
    if (!selectedTicket.value) return;

    updateForm.put(route('tickets.update', selectedTicket.value.id), {
        onSuccess: () => {
            selectedTicket.value = null;
            isEditSheetOpen.value = false;

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
        <div class="flex-1 space-y-6 md:p-8 md:pt-6 p-4 pt-2">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <HeadingLarge title="Tickets" description="Here's a list of your tickets!" />
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

            <TicketsDataTable :tickets="tickets" @edit="handleEdit" @delete="handleDelete" />

            <!-- Edit Sheet -->
            <Sheet v-model:open="isEditSheetOpen">
                <SheetContent side="right" class="sm:max-w-[500px]">
                    <SheetHeader>
                        <SheetTitle>Edit Ticket</SheetTitle>
                        <SheetDescription>Update ticket details</SheetDescription>
                    </SheetHeader>
                    <form v-if="selectedTicket" @submit.prevent="updateTicket" class="space-y-4 mt-4 p-4">
                        <div class="grid gap-4">
                            <div class="grid grid-cols-4 items-center gap-4">
                                <Label for="update-title" class="text-right">Title</Label>
                                <Input id="update-title" v-model="updateForm.title" class="col-span-4" />
                                <span class="text-sm text-red-500 col-span-full" v-if="updateForm.errors.title">
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
                                        <SelectItem v-for="client in clients" :key="client.id" :value="client.id">
                                            {{ client.name }}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <span class="text-sm text-red-500 col-span-full" v-if="updateForm.errors.client_id">
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
                                <span class="text-sm text-red-500 col-span-full" v-if="updateForm.errors.status">
                                    {{ updateForm.errors.status }}
                                </span>
                            </div>

                            <div class="grid grid-cols-4 items-center gap-4">
                                <Label for="update-description" class="text-right">Description</Label>
                                <Textarea id="update-description" v-model="updateForm.description" class="col-span-4" />
                                <span class="text-sm text-red-500 col-span-full" v-if="updateForm.errors.description">
                                    {{ updateForm.errors.description }}
                                </span>
                            </div>

                        </div>

                        <div class="flex justify-end gap-2">
                            <Button variant="outline" class="cursor-pointer" type="button"
                                @click="isEditSheetOpen = false">Cancel</Button>

                            <Button type="submit" class="cursor-pointer">Save Changes</Button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    </AppLayout>
</template>
