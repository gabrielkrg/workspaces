<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/vue3'; // Se estiver usando Inertia!

const props = defineProps({
    token: String,
});

const acceptInvite = () => {
    router.get(route('workspace.invite.accept', { token: props.token }));
};
</script>

<template>
    <div class="bg-background flex min-h-screen items-center justify-center px-4 py-12">
        <div class="w-full max-w-md space-y-8">
            <div class="text-center">
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Invite to Workspace</h2>
                <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    You were invited to join the workspace <span class="font-semibold"></span>.
                </p>
            </div>

            <div class="bg-sidebar-accent space-y-6 rounded-lg p-6 shadow-lg">
                <div class="space-y-2">
                    <p class="text-center text-sm text-gray-700 dark:text-gray-300">Accept the invitation to collaborate.</p>
                </div>

                <div class="flex flex-col gap-3">
                    <Button :class="`cursor-pointer`" type="button" @click="acceptInvite">Accept invite</Button>
                </div>
            </div>
        </div>
    </div>
</template>
