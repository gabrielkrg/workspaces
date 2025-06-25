<script setup lang="ts">
import { SquareStack } from 'lucide-vue-next';
</script>

<template>
    <div
        class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
        <SquareStack class="size-5 text-white dark:text-black" />
    </div>
    <div class="ml-1 grid flex-1 text-left text-sm">
        <span class="mb-0.5 truncate leading-none font-semibold">Workspaces</span>
    </div>
</template>
