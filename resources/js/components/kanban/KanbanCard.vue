<script setup lang="ts">
defineProps<{
    title: string;
    description: string;
}>();
</script>

<template>
    <div class="cursor-pointer rounded-lg bg-white p-3 shadow-sm hover:shadow-md transition-shadow"
        @click="$emit('click')">
        <h4 class="font-medium">{{ title }}</h4>
        <p class="text-sm text-gray-500">{{ description }}</p>
    </div>
</template>