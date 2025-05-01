<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type SharedData, type User } from '@/types';
import { useForm, usePage } from '@inertiajs/vue3';
import { SquareStack } from 'lucide-vue-next';
import { ref } from 'vue';

const page = usePage<SharedData>();

const user = page.props.auth.user as User;

const setForm = useForm({
    workspace_id: user?.workspace?.id,
});

const open = ref(false);

const set = () => {
    setForm.patch(route('workspace.set'), {
        preserveScroll: true,
        onSuccess: () => {
            open.value = false;
        },
        onError: (errors) => {
            console.log(errors);
        },
    });
};
</script>

<template>
    <Dialog>
        <DialogTrigger as-child class="fixed top-3 right-3 md:top-5 md:right-5">
            <Button variant="secondary" size="sm" class="z-40 cursor-pointer"> <SquareStack /> Change workspace </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Change workspace</DialogTitle>
                <DialogDescription> Select the workspace and click save to change to it. </DialogDescription>
            </DialogHeader>

            <form @submit.prevent="set">
                <div class="flex flex-col space-y-2">
                    <Label for="workspace">Workspace</Label>
                    <Select v-model="setForm.workspace_id">
                        <SelectTrigger id="workspace" class="w-full">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectItem v-for="workspace in user?.workspaces" :key="workspace.id" :value="workspace.id">
                                {{ workspace.name }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <DialogFooter>
                    <Button type="submit" class="cursor-pointer"> Save changes </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>
