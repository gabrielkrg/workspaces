<script setup lang="ts">
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuGroup, DropdownMenuTrigger, DropdownMenuShortcut, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { PocketKnife } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import QuickCard from './QuickCard.vue';

const props = defineProps<{
    column_id: number;
    kanban_id: number;
}>();

const emit = defineEmits(['update']);

const open = ref(false);
const openCreateCard = ref(false);

const down = (e: KeyboardEvent) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        open.value = !open.value;
    }

    if (e.key === 'c' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        openCreateCard.value = !openCreateCard.value;
    }
}

onMounted(() => {
    window.addEventListener('keydown', down);
})
</script>

<template>
    <DropdownMenu v-model:open="open">
        <DropdownMenuTrigger as-child>
            <Button class="fixed bottom-4 right-4" size="icon">
                <PocketKnife class="w-4 h-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56" align="end" side="left">
            <DropdownMenuLabel class="text-xs font-medium text-muted-foreground">Actions</DropdownMenuLabel>
            <DropdownMenuGroup>
                <DropdownMenuItem>
                    New Card
                    <DropdownMenuShortcut>⌘+C</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>


    <QuickCard :open="openCreateCard" :column_id="column_id" :kanban_id="kanban_id" @update="emit('update')" />
</template>