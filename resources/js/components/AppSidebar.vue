<script setup lang="ts">
import NavFooter from '@/components/NavFooter.vue';
import NavMain from '@/components/NavMain.vue';
import NavUser from '@/components/NavUser.vue';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Clock, LayoutGrid, ListTodo, NotebookText, SquareKanban, Tags, Ticket, User } from 'lucide-vue-next';
import NavWorkspace from './NavWorkspace.vue';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Tasks',
        href: '/tasks',
        icon: ListTodo,
    },
    {
        title: 'Kanban',
        href: '/kanban',
        icon: SquareKanban,
    },
    {
        title: 'Tags',
        href: '/tags',
        icon: Tags,
    },
    // {
    //     title: 'Calendar',
    //     href: '/calendar',
    //     icon: CalendarFold,
    // },
    {
        title: 'Notes',
        href: '/notes',
        icon: NotebookText,
    },
    {
        title: 'Tickets',
        href: '/tickets',
        icon: Ticket,
    },
    {
        title: 'Clients',
        href: '/clients',
        icon: User,
    },
    {
        title: 'Time Tracking',
        href: '/time-tracking',
        icon: Clock,
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Github Repo',
    //     href: 'https://github.com/laravel/vue-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits',
    //     icon: BookOpen,
    // },
];
</script>

<template>
    <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
            <NavWorkspace />
        </SidebarHeader>

        <SidebarContent>
            <NavMain :items="mainNavItems" />
        </SidebarContent>

        <SidebarFooter>
            <NavFooter :items="footerNavItems" />
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>
