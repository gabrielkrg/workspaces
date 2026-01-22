<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { router } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ChromePicker } from 'vue-color';

const form = useForm({
    name: '',
    color: '#68CCCA',
});

const submit = () => {
    form.post(route('tags.store'), {
        onSuccess: () => {
            form.reset();
            form.color = '#68CCCA';

            router.get(route('tags.index'), {
                preserveState: true,
                replace: true,
            });
        },
    });
};
</script>

<template>
    <Sheet>
        <SheetTrigger as-child>
            <Button variant="default" class="cursor-pointer"> Create </Button>
        </SheetTrigger>
        <SheetContent>
            <form @submit.prevent="submit">
                <SheetHeader>
                    <SheetTitle>Create tag</SheetTitle>
                    <SheetDescription> Fill the fields to create a new tag. Click save when you're done.
                    </SheetDescription>
                </SheetHeader>
                <div class="grid gap-4 p-4">
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="name" class="text-right"> Name </Label>
                        <Input id="name" v-model="form.name" class="col-span-4" />
                        <div v-if="form.errors.name" class="text-sm text-red-500 col-span-full">
                            {{ form.errors.name }}
                        </div>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="color" class="text-right"> Color </Label>
                        <ChromePicker v-model="form.color" class="col-span-4" />
                    </div>
                </div>
                <SheetFooter>
                    <Button type="submit" class="cursor-pointer"> Save </Button>
                </SheetFooter>
            </form>
        </SheetContent>
    </Sheet>
</template>
