import type { PageProps } from '@inertiajs/core';
import type { LucideIcon } from 'lucide-vue-next';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon;
    isActive?: boolean;
}

export interface SharedData extends PageProps {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
}

interface Workspace {
    id: number;
    name: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    workspace: Workspace;
    workspaces: Workspace[];
}

export type BreadcrumbItemType = BreadcrumbItem;


export interface Task {
    id: number;
    title: string;
    description: string;
    done: boolean;
    created_at: string;
    updated_at: string;
    repeat: string;
    client_id: number;
    delete_after: boolean;
    tags: [];
}

export interface Tag {
    id: number;
    name: string;
    color: string;
}