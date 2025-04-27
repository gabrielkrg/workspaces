<script setup lang="ts">
import HeadingSmall from '@/components/HeadingSmall.vue';
import InputError from '@/components/InputError.vue';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInitials } from '@/composables/useInitials';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/vue3';

import axios from 'axios';
import { Trash2Icon } from 'lucide-vue-next';
import { computed, ref } from 'vue';

const props = defineProps({
    user: Object,
});

const { getInitials } = useInitials();
const showAvatar = computed(() => props.user.avatar && props.user.avatar !== '');

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Workspace settings',
        href: '/settings/workspace',
    },
];

const isDialogEditOpen = ref(false);
const isDialogCreateOpen = ref(false);

const updateForm = useForm({
    name: props.user?.workspace?.name,
    users: props.user?.workspace?.users,
});

const update = () => {
    updateForm.put(route('workspace.update', props.user.workspace), {
        preserveScroll: true,
        onSuccess: () => updateForm.reset(),
        onError: (errors) => {
            console.log(errors);
        },
    });

    isDialogEditOpen.value = false;
};

const removeUser = (userId) => {
    updateForm.users = updateForm.users.filter((user) => user.id !== userId);
};

const setForm = useForm({
    workspace_id: props.user?.workspace_id,
});

const set = () => {
    setForm.patch(route('workspace.set'), {
        preserveScroll: true,
    });
};

const createForm = useForm({
    name: '',
});

const create = () => {
    createForm.post(route('workspace.store'), {
        preserveScroll: true,
        onSuccess: () => createForm.reset(),
    });

    isDialogCreateOpen.value = false;
};

const deleteWorkspace = (workspaceId) => {
    router.delete(route('workspace.destroy', workspaceId), {
        preserveScroll: true,
        onSuccess: () => createForm.reset(),
    });
};

const workspaceLink = ref(props.user?.workspace_id);
const link = ref('');
const copied = ref(false);
const link_errors = ref('');

const genereteLink = () => {
    if (workspaceLink.value == null) return;
    link.value = '';

    axios
        .post(route('workspace.invite.generate', workspaceLink.value))
        .then((res) => {
            const inviteUrl = res.data.url;
            console.log('Invite Link:', inviteUrl);

            link.value = inviteUrl;
        })
        .catch((error) => {
            if (error.response && error.response.status === 403) {
                link_errors.value = 'You have no permission to create a link to this workspace.';
            } else {
                console.error(error);
            }
        });
};

const clipboard_errors = ref('');
const copyToClipboard = async (link) => {
    if (!navigator.clipboard) {
        clipboard_errors.value = "Your browser doesn't support automatic copy. Copy it manually";
        return;
    }

    try {
        await navigator.clipboard.writeText(link);
        copied.value = true;
        setTimeout(() => (copied.value = false), 2000);
    } catch (e) {
        console.error('Erro ao copiar:', e);
    }
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Workspace settings" />

        <SettingsLayout>
            <div class="flex flex-wrap gap-3">
                <Dialog v-model:open="isDialogEditOpen">
                    <DialogTrigger as-child>
                        <Button variant="outline"> Edit Workspace </Button>
                    </DialogTrigger>
                    <DialogContent class="sm:max-w-[425px]">
                        <form @submit.prevent="update" class="mb-6 space-y-6">
                            <DialogHeader>
                                <DialogTitle>Edit Workspace</DialogTitle>
                                <DialogDescription> Make changes to your workspace here. Click save when you're done. </DialogDescription>
                            </DialogHeader>
                            <div class="grid gap-4 py-4">
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="name" class="text-right"> Name </Label>
                                    <Input id="name" v-model="updateForm.name" class="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit"> Save changes </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog v-model:open="isDialogCreateOpen">
                    <DialogTrigger as-child>
                        <Button variant="outline"> Create Workspace </Button>
                    </DialogTrigger>
                    <DialogContent class="sm:max-w-[425px]">
                        <form @submit.prevent="create" class="mb-6 space-y-6">
                            <DialogHeader>
                                <DialogTitle>Create Workspace</DialogTitle>
                                <DialogDescription> Create a workspace here. Click save when you're done. </DialogDescription>
                            </DialogHeader>
                            <div class="grid gap-4 py-4">
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="name" class="text-right"> Name </Label>
                                    <Input id="name" v-model="createForm.name" class="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit"> Save </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div class="space-y-6 divide-y">
                <div class="flex flex-col space-y-6">
                    <HeadingSmall title="Current workspace" description="Change your current workspace" />

                    <form @submit.prevent="set" class="mb-6">
                        <div class="flex flex-col space-y-2">
                            <Label for="workspace">Workspace</Label>
                            <Select v-model="setForm.workspace_id">
                                <SelectTrigger id="workspace" class="w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem v-for="workspace in props.user?.workspaces" :key="workspace.id" :value="workspace.id">
                                        {{ workspace.name }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div class="flex flex-wrap items-center gap-3">
                            <Button :disabled="setForm.processing">Save</Button>

                            <AlertDialog>
                                <AlertDialogTrigger as-child>
                                    <Button variant="destructive"> Delete </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will remove the workspace
                                            <span class="font-bold text-red-900">{{ user.workspace?.name }}</span> and tasks permanently.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                                        <Button variant="destructive" type="button" @click="deleteWorkspace(user.workspace_id)">
                                            <button type="submit">Delete</button>
                                        </Button>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <Transition
                                enter-active-class="transition ease-in-out"
                                enter-from-class="opacity-0"
                                leave-active-class="transition ease-in-out"
                                leave-to-class="opacity-0"
                            >
                                <p v-show="setForm.recentlySuccessful" class="text-sm text-neutral-600">Saving.</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <div class="flex flex-col space-y-6">
                    <HeadingSmall title="Generate link" description="Select the workspace that you want to create a access link" />

                    <form @submit.prevent="genereteLink" class="mb-6">
                        <div class="flex flex-col space-y-2">
                            <Label for="generate">Workspace</Label>
                            <Select v-model="workspaceLink">
                                <SelectTrigger id="generate" class="w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem v-for="workspace in props.user?.workspaces" :key="workspace.id" :value="workspace.id">
                                        {{ workspace.name }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button>Generate</Button>
                    </form>
                </div>
                <div v-if="link != ''" class="">
                    <div class="mb-6 flex gap-2">
                        <Input type="text" v-model="link" readonly @click="$event.target.select()" />

                        <Button type="button" @click="copyToClipboard(link)" class="cursor-pointer">
                            {{ copied ? 'Copied!' : 'Copy' }}
                        </Button>
                    </div>
                    <InputError :message="clipboard_errors" class="mb-6" />
                </div>

                <div class="space-y-6">
                    <HeadingSmall title="Manage users" description="Manage the users permissions for the current selected workspace" />
                    <Card class="mb-6 w-full">
                        <CardHeader>
                            <CardTitle>People with access</CardTitle>
                            <CardDescription>Below are the people with access to the current workspace.</CardDescription>
                        </CardHeader>
                        <form class="space-y-4" @submit.prevent="update">
                            <CardContent class="space-y-6 divide-y">
                                <div
                                    class="flex flex-col flex-wrap items-start justify-between pb-6 md:flex-row md:items-center"
                                    v-for="user in updateForm.users"
                                    :key="user.id"
                                >
                                    <div class="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage v-if="showAvatar" :src="user.avatar" :alt="user.name" />
                                            <AvatarFallback class="text-black dark:text-white">
                                                {{ getInitials(user.name) }}
                                            </AvatarFallback>
                                        </Avatar>

                                        <HeadingSmall :title="user.name" :description="user.email" />
                                    </div>

                                    <div class="mt-2 flex gap-3">
                                        <Select v-model="user.pivot.role" :key="user.id">
                                            <SelectTrigger id="role">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                <SelectItem value="owner"> Owner </SelectItem>
                                                <SelectItem value="viewer"> Can view </SelectItem>
                                                <SelectItem value="editor"> Can edit </SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <AlertDialog>
                                            <AlertDialogTrigger as-child>
                                                <Button variant="destructive"> <Trash2Icon /> </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will remove the user from ther current workspace.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                                                    <Button variant="destructive" type="button" @click="removeUser(user.id)">
                                                        <button type="submit">Delete</button>
                                                    </Button>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter class="flex justify-between">
                                <Button>Save</Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </SettingsLayout>
    </AppLayout>
</template>
