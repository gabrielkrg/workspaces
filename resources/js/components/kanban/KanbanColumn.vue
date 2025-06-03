<script setup lang="ts">
import { Plus } from 'lucide-vue-next';

defineProps<{
    name: string;
}>();

defineEmits<{
    'add-card': [];
}>();
</script>

<template>
    <div class="flex h-full w-72 flex-shrink-0 flex-col p-4 bg-sidebar-accent border-sidebar-border rounded-xl border">
        <div class="mb-4 flex items-center justify-between">
            <h3 class="font-semibold text-black dark:text-white">{{ name }}</h3>
            <button @click="$emit('add-card')"
                class="cursor-pointer p-2 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent rounded-md"
                title="Add new card">
                <Plus class="h-5 w-5" />
            </button>
        </div>
        <div class="flex flex-1 flex-col gap-2 overflow-y-auto">
            <slot />
        </div>
    </div>
</template>