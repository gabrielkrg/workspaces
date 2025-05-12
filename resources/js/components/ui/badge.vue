<script setup lang="ts">
import { computed } from 'vue';
import { badgeVariants } from './badge';

const props = defineProps<{
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    class?: string;
}>();

const classes = computed(() => {
    return badgeVariants({ variant: props.variant, class: props.class });
});
</script>

<template>
    <div :class="classes">
        <slot />
    </div>
</template>