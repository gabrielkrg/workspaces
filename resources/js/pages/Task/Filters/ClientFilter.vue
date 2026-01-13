<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

defineProps<{
    modelValue: number | string | null,
    clients: any[]
}>();

const emit = defineEmits<{
    'update:modelValue': [value: any]
}>();
</script>

<template>
    <div class="flex flex-col gap-1.5 w-full md:w-[150px]">
        <Select :model-value="modelValue" @update:model-value="val => emit('update:modelValue', val)">
            <SelectTrigger id="client" class="w-full">
                <SelectValue placeholder="Client" />
            </SelectTrigger>
            <SelectContent position="popper">
                <SelectItem :value="null"> All Clients </SelectItem>
                <SelectItem v-for="client in clients" :key="client.id" :value="client.id?.toString()">
                    {{ client.name }}
                </SelectItem>
            </SelectContent>
        </Select>
    </div>
</template>
