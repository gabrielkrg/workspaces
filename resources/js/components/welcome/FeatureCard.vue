<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
    title: string;
    description: string;
    icon: Component;
    href?: string;
}>();
</script>

<template>
    <div class="group relative rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
        <div class="flex items-start gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <component :is="icon" class="h-5 w-5" />
            </div>
            <div class="flex-1">
                <h3 class="text-lg font-semibold text-foreground">
                    {{ title }}
                </h3>
                <p class="mt-2 text-sm text-muted-foreground">
                    {{ description }}
                </p>
            </div>
        </div>
    </div>
</template>
