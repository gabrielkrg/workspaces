<script setup lang="ts">
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { type SharedData, type User } from '@/types';
import { usePage } from '@inertiajs/vue3';
import { Box, ChevronsUpDown } from 'lucide-vue-next';
import WorkspaceMenuContent from './WorkspaceMenuContent.vue';
import { watch } from 'vue';

const page = usePage<SharedData>();
const user = page.props.auth.user as User;
const { isMobile, state } = useSidebar();
</script>

<template>
    <SidebarMenu>
        <SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <SidebarMenuButton size="lg"
                        class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                        <div class="flex items-center gap-2">
                            <Box class="size-6 overflow-hidden rounded-lg" />
                        </div>

                        <div class="grid flex-1 text-left text-sm leading-tight">
                            <span class="text-xs text-sidebar-accent-foreground">
                                Workspace
                            </span>
                            <span class="mb-0.5 truncate leading-none font-semibold">{{ user.workspace.name }}</span>
                        </div>

                        <ChevronsUpDown class="ml-auto size-4" />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                    :side="isMobile ? 'left' : state === 'collapsed' ? 'left' : 'left'" align="start" :side-offset="4">
                    <WorkspaceMenuContent :workspaces="user.workspaces" />
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    </SidebarMenu>
</template>
