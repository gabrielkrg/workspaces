<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

defineProps<{
    modelValue: string
}>();

const emit = defineEmits<{
    'update:modelValue': [value: any]
}>();
</script>

<template>
    <div class="flex flex-col gap-1.5 w-full md:w-[120px]">
        <Select :model-value="modelValue" @update:model-value="val => emit('update:modelValue', val)">
            <SelectTrigger id="order" class="w-full">
                <SelectValue placeholder="Order by" />
            </SelectTrigger>
            <SelectContent position="popper">
                <SelectItem value="recent"> Recent </SelectItem>
                <SelectItem value="oldest"> Oldest </SelectItem>
                <SelectItem value="title"> Title </SelectItem>
                <SelectItem value="highlight"> Highlight </SelectItem>
            </SelectContent>
        </Select>
    </div>
</template>
