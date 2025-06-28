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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: '/clients',
    },
];

const props = defineProps({
    clients: Array,
});

const form = useForm({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
});

const submit = () => {
    form.post(route('clients.store'), {
        onSuccess: () => {
            form.reset();

            router.get(route('clients.index'), {
                preserveState: true,
                replace: true,
            });
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

const selectedClient = ref(null);

const updateForm = useForm({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
});

const selectClient = (client) => {
    selectedClient.value = client;

    updateForm.name = client.name;
    updateForm.email = client.email;
    updateForm.phone = client.phone;
    updateForm.address = client.address;
    updateForm.city = client.city;
    updateForm.state = client.state;
    updateForm.zip = client.zip;
};

const update = (clientId) => {
    if (selectedClient.value == null) return;

    updateForm.put(route('clients.update', clientId), {
        onSuccess: () => {
            updateForm.reset();

            router.get(route('clients.index'), {
                preserveState: true,
                replace: true,
            });
        },
    });
};

const deleteClient = (clientId) => {
    router.delete(route('clients.delete', clientId), {
        preserveScroll: true,
        onSuccess: () => {
            router.get(route('clients.index'), {
                preserveState: true,
                replace: true,
            });
        },
        onError: (errors) => {
            console.log('Erro ao deletar cliente:', errors);
        },
    });
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<template>

    <Head title="Clients" />

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
                                <SheetTitle>Create client</SheetTitle>
                                <SheetDescription> Fill the fields to create a new client. Click save when you're done.
                                </SheetDescription>
                            </SheetHeader>
                            <div class="grid gap-4 p-4">
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="name" class="text-right"> Name </Label>
                                    <Input id="name" v-model="form.name" class="col-span-4" />
                                    <span class="text-sm text-red-500 col-span-full" v-if="form.errors.name">
                                        {{ form.errors.name }}
                                    </span>
                                </div>
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="email" class="text-right"> Email </Label>
                                    <Input id="email" v-model="form.email" class="col-span-4" />
                                    <span class="text-sm text-red-500 col-span-full" v-if="form.errors.email">
                                        {{ form.errors.email }}
                                    </span>
                                </div>
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="phone" class="text-right"> Phone </Label>
                                    <Input id="phone" v-model="form.phone" class="col-span-4" />
                                    <span class="text-sm text-red-500 col-span-full" v-if="form.errors.phone">
                                        {{ form.errors.phone }}
                                    </span>
                                </div>
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="address" class="text-right"> Address </Label>
                                    <Input id="address" v-model="form.address" class="col-span-4" />
                                    <span class="text-sm text-red-500 col-span-full" v-if="form.errors.address">
                                        {{ form.errors.address }}
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
                v-if="clients.length > 0">
                <!-- clients -->
                <div v-for="client in clients" :key="client.id" class="group flex items-start gap-4 border-b p-4">

                    <!-- Name -->
                    <div class="flex-1 min-w-0">
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                            {{ client.name }}
                        </h2>
                    </div>

                    <!-- Actions -->
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
                                        <div @click="selectClient(client)"
                                            class="dark:hover:bg-muted block w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100">
                                            Edit
                                        </div>
                                    </SheetTrigger>
                                    <SheetContent>
                                        <form @submit.prevent="update(client.id)">
                                            <SheetHeader>
                                                <SheetTitle>Edit client</SheetTitle>
                                                <SheetDescription>Click save when you're done.</SheetDescription>
                                            </SheetHeader>
                                            <div class="grid gap-4 p-4">
                                                <div class="grid grid-cols-4 items-center gap-4">
                                                    <Label for="name" class="text-right">Name</Label>
                                                    <Input id="name" v-model="updateForm.name" class="col-span-4" />
                                                    <span class="text-sm text-red-500 col-span-full"
                                                        v-if="updateForm.errors.name">
                                                        {{ updateForm.errors.name }}
                                                    </span>
                                                </div>

                                                <div class="grid grid-cols-4 items-center gap-4">
                                                    <Label for="email" class="text-right">Email</Label>
                                                    <Input id="email" v-model="updateForm.email" class="col-span-4" />
                                                    <span class="text-sm text-red-500 col-span-full"
                                                        v-if="updateForm.errors.email">
                                                        {{ updateForm.errors.email }}
                                                    </span>
                                                </div>

                                                <div class="grid grid-cols-4 items-center gap-4">
                                                    <Label for="phone" class="text-right">Phone</Label>
                                                    <Input id="phone" v-model="updateForm.phone" class="col-span-4" />
                                                    <span class="text-sm text-red-500 col-span-full"
                                                        v-if="updateForm.errors.phone">
                                                        {{ updateForm.errors.phone }}
                                                    </span>
                                                </div>

                                                <div class="grid grid-cols-4 items-center gap-4">
                                                    <Label for="address" class="text-right">Address</Label>
                                                    <Input id="address" v-model="updateForm.address"
                                                        class="col-span-4" />
                                                    <span class="text-sm text-red-500 col-span-full"
                                                        v-if="updateForm.errors.address">
                                                        {{ updateForm.errors.address }}
                                                    </span>
                                                </div>

                                            </div>
                                            <SheetFooter>
                                                <Button type="submit">Save changes</Button>
                                            </SheetFooter>
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

                                    <DialogContent>
                                        <DialogHeader class="space-y-3">
                                            <DialogTitle>Are you sure you want to delete this client?
                                            </DialogTitle>
                                            <DialogDescription>
                                                Once your client is deleted, there's no way to recover it.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <DialogFooter class="gap-2">
                                            <DialogClose as-child>
                                                <Button variant="secondary" class="cursor-pointer"
                                                    type="button">Cancel</Button>
                                            </DialogClose>

                                            <Button variant="destructive" class="cursor-pointer" type="button"
                                                @click="deleteClient(client.id)">
                                                Delete client
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
                <p class="text-gray-800 dark:text-gray-100">There are no clients yet</p>
            </div>
        </div>
    </AppLayout>
</template>
