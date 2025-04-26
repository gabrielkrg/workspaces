<script setup lang="ts">
import { Head, useForm, usePage } from '@inertiajs/vue3';

import HeadingSmall from '@/components/HeadingSmall.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { type BreadcrumbItem, type SharedData, type User } from '@/types';
import { AccordionContent, AccordionItem, AccordionRoot, AccordionTrigger } from 'reka-ui';

import axios from 'axios';
import { ChevronDown } from 'lucide-vue-next';
import { ref } from 'vue';

const props = defineProps({
    workspaces: Array,
});

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Workspace settings',
        href: '/settings/workspace',
    },
];

const page = usePage<SharedData>();
const user = page.props.auth.user as User;

const updateForm = useForm({
    workspace_id: user.workspace_id,
});

const update = () => {
    updateForm.patch(route('workspace.update'), {
        preserveScroll: true,
    });
};

const createForm = useForm({
    name: '',
});

const create = () => {
    createForm.post(route('workspace.store'), {
        preserveScroll: true,
    });
};

const workspaceLink = ref(user.workspace_id);
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
        clipboard_errors.value = "Browser doesn't support automatic copy. Copy it manually";
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
            <AccordionRoot type="single" collapsible defaultValue="workspace-info" class="w-full divide-y">
                <!-- Primeiro: Workspace Information -->
                <AccordionItem value="workspace-info">
                    <AccordionTrigger class="flex w-full cursor-pointer items-center justify-between py-2 text-xl font-semibold">
                        <span>Workspace information</span>
                        <ChevronDown class="h-5 w-5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    </AccordionTrigger>
                    <AccordionContent>
                        <div class="flex flex-col space-y-6">
                            <HeadingSmall title="" description="Change you current and manage your current workspace" />

                            <form @submit.prevent="update" class="mb-6 space-y-6">
                                <div class="grid gap-2">
                                    <Label for="current">Current workspace</Label>
                                    <select
                                        id="current"
                                        v-model="updateForm.workspace_id"
                                        class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive mt-1 block h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                    >
                                        <option v-for="workspace in workspaces" :key="workspace.id" :value="workspace.id">
                                            {{ workspace.name }}
                                        </option>
                                    </select>
                                    <InputError class="mt-2" :message="updateForm.errors.workspace_id" />
                                </div>

                                <div class="flex items-center gap-4">
                                    <Button :disabled="updateForm.processing">Change</Button>

                                    <Transition
                                        enter-active-class="transition ease-in-out"
                                        enter-from-class="opacity-0"
                                        leave-active-class="transition ease-in-out"
                                        leave-to-class="opacity-0"
                                    >
                                        <p v-show="updateForm.recentlySuccessful" class="text-sm text-neutral-600">Changed.</p>
                                    </Transition>
                                </div>
                            </form>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <!-- Segundo: Generate Workspace Link -->
                <AccordionItem value="generate-link">
                    <AccordionTrigger class="flex w-full cursor-pointer items-center justify-between py-2 text-xl font-semibold">
                        <span>Generate workspace link</span>
                        <ChevronDown class="h-5 w-5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    </AccordionTrigger>
                    <AccordionContent>
                        <div class="flex flex-col space-y-6">
                            <HeadingSmall title="" description="Select the workspace and click generate to get a access link" />

                            <form @submit.prevent="genereteLink" class="mb-6 space-y-6">
                                <div class="grid gap-2">
                                    <Label for="generate">Workspace</Label>
                                    <select
                                        id="generate"
                                        v-model="workspaceLink"
                                        class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive mt-1 block h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                    >
                                        <option v-for="workspace in workspaces" :key="workspace.id" :value="workspace.id">
                                            {{ workspace.name }}
                                        </option>
                                    </select>
                                    <InputError :message="link_errors" />
                                </div>

                                <div class="flex items-center gap-4">
                                    <Button>Generate</Button>
                                </div>
                            </form>
                            <div class="mb-6 items-center" v-if="link != ''">
                                <div class="flex gap-2">
                                    <input
                                        type="text"
                                        :value="link"
                                        readonly
                                        @click="$event.target.select()"
                                        class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive block h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                    />

                                    <Button type="button" @click="copyToClipboard(link)" class="cursor-pointer">
                                        {{ copied ? 'Copied!' : 'Copy' }}
                                    </Button>
                                </div>
                                <InputError :message="clipboard_errors" />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <!-- Terceiro: Create Workspace -->
                <AccordionItem value="create-workspace">
                    <AccordionTrigger class="flex w-full cursor-pointer items-center justify-between py-2 text-xl font-semibold">
                        <span>Create new workspace</span>
                        <ChevronDown class="h-5 w-5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    </AccordionTrigger>
                    <AccordionContent>
                        <div class="flex flex-col space-y-6">
                            <HeadingSmall title="" description="Your workspace will be create and viculated to your user" />

                            <form @submit.prevent="create" class="mb-6 space-y-6">
                                <div class="grid gap-2">
                                    <Label for="create">Name</Label>
                                    <Input
                                        id="create"
                                        class="mt-1 block w-full"
                                        v-model="createForm.name"
                                        required
                                        autocomplete="name"
                                        placeholder=""
                                    />

                                    <InputError class="mt-2" :message="createForm.errors.name" />
                                </div>

                                <div class="flex items-center gap-4">
                                    <Button :disabled="createForm.processing">Create</Button>

                                    <Transition
                                        enter-active-class="transition ease-in-out"
                                        enter-from-class="opacity-0"
                                        leave-active-class="transition ease-in-out"
                                        leave-to-class="opacity-0"
                                    >
                                        <p v-show="createForm.recentlySuccessful" class="text-sm text-neutral-600">Created.</p>
                                    </Transition>
                                </div>
                            </form>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </AccordionRoot>
        </SettingsLayout>
    </AppLayout>
</template>
