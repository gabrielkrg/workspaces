<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

defineProps<{
    modelValue: string | null | boolean
}>();

const emit = defineEmits<{
    'update:modelValue': [value: any]
}>();
</script>

<template>
    <div class="flex flex-col gap-1.5 w-full md:w-[120px]">
        <Select :model-value="modelValue" @update:model-value="val => emit('update:modelValue', val)">
            <SelectTrigger id="status" class="w-full">
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent position="popper">
                <SelectItem :value="null"> All Status </SelectItem>
                <SelectItem value="false"> To do </SelectItem>
                <SelectItem value="true"> Done </SelectItem>
            </SelectContent>
        </Select>
    </div>
</template>
