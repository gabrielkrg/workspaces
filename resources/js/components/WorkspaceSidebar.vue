<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import axios from 'axios';
import { CircleFadingPlus } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import InputError from './InputError.vue';
import { Button } from './ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';

const form = useForm({
    name: '',
});

const submit = () => {
    form.post(route('workspaces.store'), {
        onSuccess: () => {
            form.reset();
        },
    });
};

const workspaces = ref([]);

onMounted(async () => {
    try {
        const response = await axios.get('/api/workspaces');
        workspaces.value = response.data;
    } catch (error) {
        console.error('Erro ao carregar workspaces:', error);
    }
});
</script>
<template>
    <SidebarGroup class="px-2 py-0">
        <SidebarGroupLabel>Workspace</SidebarGroupLabel>

        <SidebarMenu>
            <SidebarMenuItem v-for="item in workspaces" :key="item.name">
                <SidebarMenuButton as-child>
                    <div
                        class="peer/menu-button ring-sidebar-ring active:bg-sidebar-accent active:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex h-8 w-full cursor-pointer items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:pr-2! focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-medium [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0"
                    >
                        <span>{{ item.name }}</span>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>

        <Dialog>
            <DialogTrigger as-child>
                <div class="flex w-full min-w-0 flex-col gap-1">
                    <div class="group/menu-item relative">
                        <div
                            class="peer/menu-button ring-sidebar-ring active:bg-sidebar-accent active:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex h-8 w-full cursor-pointer items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:pr-2! focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-medium [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0"
                        >
                            <CircleFadingPlus />
                            <span>Create</span>
                        </div>
                    </div>
                </div>
            </DialogTrigger>

            <DialogContent>
                <form class="space-y-6" @submit.prevent="submit">
                    <DialogHeader class="space-y-3">
                        <DialogTitle>Create Workspace</DialogTitle>
                        <!-- <DialogDescription> Fill the informations above to create a new Workspace. </DialogDescription> -->
                    </DialogHeader>

                    <div class="grid gap-2">
                        <Label for="name">Name</Label>
                        <Input id="name" type="text" class="mt-1 block w-full" v-model="form.name" required placeholder="Name" />
                        <InputError class="mt-2" :message="form.errors.email" />
                    </div>

                    <DialogFooter class="gap-2">
                        <DialogClose as-child>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>

                        <Button variant="default" :disabled="form.processing">
                            <button type="submit">Save</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </SidebarGroup>
</template>
