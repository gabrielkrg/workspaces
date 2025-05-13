<script setup lang="ts">
defineProps<{
    title: string;
    description: string;
}>();
</script>

<template>
    <div class="cursor-pointer rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow bg-sidebar dark:text-white text-black"
        @click="$emit('click')">
        <h4 class="font-medium">{{ title }}</h4>
        <p class="text-sm text-sidebar-accent-foreground">{{ description }}</p>
    </div>
</template>