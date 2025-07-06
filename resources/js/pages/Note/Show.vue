<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/vue3';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Editor from '@/components/Editor.vue';


const props = defineProps({
    note: {
        type: Object,
        required: true,
    },
});
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notes',
        href: '/notes',
    },
    {
        title: props.note.title,
        href: `/notes/${props.note.id}`,
    },
];

const form = useForm({
    title: props.note.title,
    content: props.note.content,
});

function saveNote() {
    form.put(`/notes/${props.note.id}`);
}
</script>

<template>

    <Head :title="form.title" />

    <AppLayout :breadcrumbs="breadcrumbs">

        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div class="flex items-end justify-between gap-4">
                <Input v-model="form.title" placeholder="Untitled document" class="text-3xl font-bold" />
                <Button :disabled="form.processing" @click="saveNote">Save</Button>
            </div>

            <Editor v-model="form.content" :editable="true" />
        </div>
    </AppLayout>
</template>
