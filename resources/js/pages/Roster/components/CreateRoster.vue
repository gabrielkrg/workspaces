<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/vue3';
import { router } from '@inertiajs/vue3';


const form = useForm({
    name: '',
});


const createRoster = () => {
    form.post(route('rosters.store'), {
        onSuccess: () => {
            router.visit(route('rosters.index'), {
                replace: true,
            });

            form.reset();
        },
    });
}

</script>

<template>
    <Dialog>
        <DialogTrigger as-child>
            <Button class="cursor-pointer">
                Create
            </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Create list</DialogTitle>
                <DialogDescription>
                    Make changes to your list here. Click save when you're done.
                </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="name" class="text-right">
                        Name
                    </Label>
                    <Input id="name" v-model="form.name" class="col-span-3" />
                    <span class="text-sm text-red-500 col-span-full" v-if="form.errors.name">
                        {{ form.errors.name }}
                    </span>
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" @click="createRoster">
                    Save
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>