<script setup lang="ts">
import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Link, router } from '@inertiajs/vue3';
import { Box, Settings } from 'lucide-vue-next';
import DropdownMenuLabel from './ui/dropdown-menu/DropdownMenuLabel.vue';
import type { Workspace } from '@/types';

interface Props {
    workspaces: Workspace[];
}

defineProps<Props>();

const setWorkspace = (workspaceId: number) => {
    router.patch(route('workspace.set'), {
        workspace_id: workspaceId,
    }, {
        onSuccess: () => {
        },
        onError: (errors) => {
            console.error('Error setting workspace:', errors);
        }
    });
};


</script>

<template>

    <DropdownMenuGroup>
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem v-for="workspace in workspaces" :key="workspace.id" :as-child="true">
            <button class="block w-full" @click="setWorkspace(workspace.id)">
                <Box class="mr-2 h-8 w-8 rounded-md" />
                {{ workspace.name }}
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
