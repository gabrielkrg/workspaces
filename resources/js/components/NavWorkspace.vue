<script setup lang="ts">
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { type SharedData, type User, type Workspace } from '@/types';
import { router, usePage } from '@inertiajs/vue3';
import { ChevronsUpDown } from 'lucide-vue-next';
import WorkspaceMenuContent from './WorkspaceMenuContent.vue';
import AppLogoIcon from './AppLogoIcon.vue';
import { computed } from 'vue';

const { isMobile, state } = useSidebar();

const page = usePage<SharedData>();

const workspaces = computed(() => (page.props.auth.user as User)?.workspaces || []);
const currentWorkspace = computed(() => (page.props.auth.user as User)?.workspace || null);

const handleWorkspaceUpdated = () => {
    router.reload({ only: ['auth'] });
};

</script>

<template>
    <SidebarMenu>
        <SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton size="lg"
                        class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                        <div
                            class="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                            <AppLogoIcon class="size-4" />
                        </div>
                        <div class="flex flex-col gap-0.5 leading-none">
                            <span class="font-medium">Workspace</span>
                            <span>{{ currentWorkspace?.name || '???' }}</span>
                        </div>
                        <ChevronsUpDown class="ml-auto" />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                    :side="isMobile ? 'bottom' : state === 'collapsed' ? 'left' : 'left'" align="start"
                    :side-offset="4">
                    <WorkspaceMenuContent :currentWorkspace="currentWorkspace" :workspaces="workspaces"
                        @workspace-updated="handleWorkspaceUpdated" />
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    </SidebarMenu>
</template>
