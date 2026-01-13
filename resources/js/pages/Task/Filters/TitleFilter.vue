<script setup lang="ts">
import { Input } from '@/components/ui/input';

defineProps<{
    modelValue: string
}>();

const emit = defineEmits<{
    'update:modelValue': [value: string],
    'submit': []
}>();
</script>

<template>
    <div class="flex flex-col gap-1.5 w-full md:w-auto md:min-w-[200px] flex-1">
        <Input :model-value="modelValue" @update:model-value="val => emit('update:modelValue', String(val))"
            @input="emit('submit')" id="search" type="search" placeholder="Search by title..." class="w-full" />
    </div>
</template>
