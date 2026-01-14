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

export interface Workspace {
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

export interface KanbanCard {
    id: number;
    title: string;
    description: string;
    order: number;
    column_id: number;
    tasks: Task[];
    tags: Tag[];
    client_id?: number;
    kanban_id?: number;
    created_at_formatted?: string;
    column?: KanbanColumn;
}

export interface KanbanColumn {
    id: number;
    name: string;
    order?: number;
    cards: KanbanCard[];
}

export interface Kanban {
    id: number;
    name: string;
    workspace_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    columns: KanbanColumn[];
    cards_count?: number;
}

export interface Trackable {
    id: number;
    title: string;
    client: Client;
}

export interface TimeTracking {
    id: number;
    start_time: string;
    end_time: string;
    duration: number;
    is_running: boolean;
    trackable_id: number | null;
    trackable_type: string;
    formatted_start_time: string;
    formatted_end_time: string | null;
    start_time_local: string;
    end_time_local: string | null;
    formatted_start_time_local: string;
    formatted_end_time_local: string | null;
    trackable: Trackable;
}

export interface Ticket {
    id: number;
    title: string;
    description: string;
    status: 'open' | 'in_progress' | 'closed' | 'pending';
    created_at: string;
    workspace_id: number;
    user_id: number;
    client_id: number;
}

export interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
}

export interface Note {
    id?: number;
    title: string;
    content: string;
}