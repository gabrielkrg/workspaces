<script setup lang="ts">
import Alert from '@/components/Alert.vue';
import QuickChangeWorkspace from '@/components/QuickChangeWorkspace.vue';

import AppLayout from '@/layouts/app/AppSidebarLayout.vue';
import type { BreadcrumbItemType } from '@/types';

interface Props {
    breadcrumbs?: BreadcrumbItemType[];
}

withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Alert v-if="$page.props.flash.success" type="success" :message="$page.props.flash.success" />
        <Alert v-if="$page.props.flash.error" type="error" :message="$page.props.flash.error" />

        <QuickChangeWorkspace />
        <slot />
    </AppLayout>
</template>
