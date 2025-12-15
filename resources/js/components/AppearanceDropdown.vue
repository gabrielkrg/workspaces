<script setup lang="ts">
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/composables/useAppearance';
import { Check, Monitor, Moon, Sun } from 'lucide-vue-next';

const props = withDefaults(defineProps<{
    class?: string;
}>(), {
    class: '',
});

const { appearance, updateAppearance } = useAppearance();

const CurrentIcon = computed(() => {
    switch (appearance.value) {
        case 'dark':
            return Moon;
        case 'light':
            return Sun;
        default:
            return Monitor;
    }
});
</script>

<template>
    <div :class="props.class">
        <DropdownMenu>
            <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="icon" class="h-9 w-9 rounded-md">
                    <component :is="CurrentIcon" class="h-5 w-5" />
                    <span class="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem @click="updateAppearance('light')" class="flex items-center justify-between">
                    <span class="flex items-center gap-2">
                        <Sun class="h-5 w-5" />
                        Light
                    </span>
                    <Check v-if="appearance === 'light'" class="w-4 h-4" />
                </DropdownMenuItem>
                <DropdownMenuItem @click="updateAppearance('dark')" class="flex items-center justify-between">
                    <span class="flex items-center gap-2">
                        <Moon class="h-5 w-5" />
                        Dark
                    </span>
                    <Check v-if="appearance === 'dark'" class="w-4 h-4" />
                </DropdownMenuItem>
                <DropdownMenuItem @click="updateAppearance('system')" class="flex items-center justify-between">
                    <span class="flex items-center gap-2">
                        <Monitor class="h-5 w-5" />
                        System
                    </span>
                    <Check v-if="appearance === 'system'" class="w-4 h-4" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
</template>
