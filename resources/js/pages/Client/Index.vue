<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/vue3';
import { onMounted, onUnmounted, ref } from 'vue';
import HeadingLarge from '@/components/HeadingLarge.vue';
import ClientsDataTable from '@/components/ClientsDataTable.vue';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: '/clients',
    },
];

defineProps({
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
const isEditSheetOpen = ref(false);

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

const handleEdit = (client) => {
    selectClient(client);
    isEditSheetOpen.value = true;
};

const handleDelete = (clientId) => {
    deleteClient(clientId);
};

const update = (clientId) => {
    if (selectedClient.value == null) return;

    updateForm.put(route('clients.update', clientId), {
        onSuccess: () => {
            updateForm.reset();
            selectedClient.value = null;
            isEditSheetOpen.value = false;

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
        <div class="flex-1 space-y-6 md:p-8 md:pt-6 p-4 pt-2">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <HeadingLarge title="Clients" description="Here's a list of your clients!" />
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

            <ClientsDataTable :clients="clients || []" @edit="handleEdit" @delete="handleDelete" />

            <!-- Edit Sheet -->
            <Sheet v-model:open="isEditSheetOpen">
                <SheetContent>
                    <form @submit.prevent="update(selectedClient?.id)" v-if="selectedClient">
                        <SheetHeader>
                            <SheetTitle>Edit client</SheetTitle>
                            <SheetDescription>Click save when you're done.</SheetDescription>
                        </SheetHeader>
                        <div class="grid gap-4 p-4">
                            <div class="grid grid-cols-4 items-center gap-4">
                                <Label for="name" class="text-right">Name</Label>
                                <Input id="name" v-model="updateForm.name" class="col-span-4" />
                                <span class="text-sm text-red-500 col-span-full" v-if="updateForm.errors.name">
                                    {{ updateForm.errors.name }}
                                </span>
                            </div>

                            <div class="grid grid-cols-4 items-center gap-4">
                                <Label for="email" class="text-right">Email</Label>
                                <Input id="email" v-model="updateForm.email" class="col-span-4" />
                                <span class="text-sm text-red-500 col-span-full" v-if="updateForm.errors.email">
                                    {{ updateForm.errors.email }}
                                </span>
                            </div>

                            <div class="grid grid-cols-4 items-center gap-4">
                                <Label for="phone" class="text-right">Phone</Label>
                                <Input id="phone" v-model="updateForm.phone" class="col-span-4" />
                                <span class="text-sm text-red-500 col-span-full" v-if="updateForm.errors.phone">
                                    {{ updateForm.errors.phone }}
                                </span>
                            </div>

                            <div class="grid grid-cols-4 items-center gap-4">
                                <Label for="address" class="text-right">Address</Label>
                                <Input id="address" v-model="updateForm.address" class="col-span-4" />
                                <span class="text-sm text-red-500 col-span-full" v-if="updateForm.errors.address">
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
        </div>
    </AppLayout>
</template>
