<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Kanban, SharedData, Workspace } from '@/types';
import { Form, usePage } from '@inertiajs/vue3';
import { clone } from '@/routes/kanban';
import { computed, ref } from 'vue';

const props = defineProps<{
    kanban: Kanban;
}>();

const page = usePage<SharedData>();

const workspaces = computed(() => page.props.auth.user?.workspaces.filter(
    (workspace: Workspace) => workspace.id !== page.props.auth.user?.workspace?.id
) || []);

const formConfig = clone.form({ kanban: props.kanban.id });
const workspaceId = ref('');
</script>

<template>
    <Dialog>
        <DialogTrigger as-child>
            <Button variant="outline">
                Clone
            </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
            <Form :action="formConfig.action" :method="formConfig.method" #default="{ errors, processing }">
                <DialogHeader>
                    <DialogTitle>Clone Kanban</DialogTitle>
                    <DialogDescription>
                        Clone this kanban, with all its cards, columns and tags to another workspace.
                    </DialogDescription>
                </DialogHeader>
                <div class="grid gap-4">
                    <Label for="workspace_id">Workspace</Label>
                    <input type="hidden" name="workspace_id" :value="workspaceId" />
                    <Select v-model="workspaceId">
                        <SelectTrigger class="w-full">
                            <SelectValue placeholder="Select a workspace" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="workspace in workspaces" :key="workspace.id" :value="workspace.id">
                                {{ workspace.name }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <span class="text-sm text-red-500" v-if="errors.workspace_id">
                        {{ errors.workspace_id }}
                    </span>
                </div>
                <DialogFooter>
                    <DialogClose as-child>
                        <Button variant="outline" type="button">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="submit" :disabled="processing">
                        Clone
                    </Button>
                </DialogFooter>
            </Form>
        </DialogContent>
    </Dialog>
</template>