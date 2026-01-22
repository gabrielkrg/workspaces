<script setup lang="ts">
interface Props {
    title: string;
    description?: string;
}

defineProps<Props>();
</script>

<template>
    <div>
        <h2 class='text-2xl font-bold tracking-tight'>{{ title }}</h2>
        <p v-if="description" class='text-muted-foreground'>
            {{ description }}
        </p>
    </div>
</template>