<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/vue3';
import type { Component } from 'vue';

interface Props {
    href: string;
    title: string;
    value: string | number;
    icon: Component;
}

defineProps<Props>();
</script>

<template>
    <Link :href="href">
        <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">
                    {{ title }}
                </CardTitle>
                <component :is="icon" class="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div class="text-2xl font-bold">
                    {{ value }}
                </div>
            </CardContent>
        </Card>
    </Link>
</template>
