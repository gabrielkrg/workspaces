<script setup lang="ts">
import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Link, router } from '@inertiajs/vue3';
import { Box, Check, Settings } from 'lucide-vue-next';
import DropdownMenuLabel from './ui/dropdown-menu/DropdownMenuLabel.vue';
import type { Workspace } from '@/types';

interface Props {
    workspaces: Workspace[];
    currentWorkspace: Workspace | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    'workspace-updated': [];
}>();

const setWorkspace = (workspaceId: number) => {
    router.patch(route('workspace.set'), {
        workspace_id: workspaceId,
    }, {
        onSuccess: () => {
            // Recarrega apenas os dados de autenticação para atualizar o workspace
            router.reload({ only: ['auth'] });
            emit('workspace-updated');
        },
        onError: (errors) => {
            console.error('Error setting workspace:', errors);
        }
    });
};


</script>

<template>

    <DropdownMenuGroup class="space-y-0.5">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem v-for="workspace in props.workspaces" :key="workspace.id" :as-child="true" :class="{
            'bg-accent': props.currentWorkspace?.id === workspace.id,
            'text-accent-foreground': props.currentWorkspace?.id === workspace.id,
            'font-medium': props.currentWorkspace?.id === workspace.id
        }">
            <button class="flex w-full items-center gap-2 px-2 py-1.5 text-left" @click="setWorkspace(workspace.id)">
                <Box class="h-8 w-8 rounded-md shrink-0" />
                <span class="flex-1">{{ workspace.name }}</span>
                <Check v-if="props.currentWorkspace?.id === workspace.id" class="h-4 w-4 shrink-0" />
            </button>
        </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />

    <DropdownMenuItem :as-child="true">
        <Link :href="route('workspace.edit')">
            <div class="flex items-center">
                <Settings class="mr-2 h-4 w-4" />
                Settings
            </div>
        </Link>
    </DropdownMenuItem>
</template>
