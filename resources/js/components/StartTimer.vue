<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/vue3';
import { Timer } from 'lucide-vue-next';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

const props = withDefaults(defineProps<{
    trackable_id: number;
    trackable_type: string;
    isRunning?: boolean;
}>(), {
    isRunning: false
});

const startTimer = () => {
    router.post(route('time-tracking.start'), {
        trackable_id: props.trackable_id,
        trackable_type: props.trackable_type,
    }, {
        onSuccess: () => {
        },
        onError: (e) => {
            console.log(e);
        },
    });
}

</script>

<template>
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger as-child>
                <Button variant="ghost" type="button" class="cursor-pointer" @click="startTimer" size="icon"
                    :disabled="isRunning" @click.stop="startTimer">
                    <Timer class="size-4" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Start tracking time</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
</template>