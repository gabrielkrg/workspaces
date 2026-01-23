<script setup lang="ts">
import FeatureCard from './FeatureCard.vue';
import { 
    LayoutGrid, 
    SquareKanban, 
    ListTodo, 
    Tags, 
    Users, 
    Clock 
} from 'lucide-vue-next';
import { useTranslation } from '@/hook/use-translation';
import { computed } from 'vue';

const { t } = useTranslation();

const features = computed(() => [
    {
        title: t('welcome.dashboard_title'),
        description: t('welcome.dashboard_description'),
        icon: LayoutGrid,
        href: '/dashboard',
    },
    {
        title: t('welcome.kanban_title'),
        description: t('welcome.kanban_description'),
        icon: SquareKanban,
        href: '/kanban',
    },
    {
        title: t('welcome.tasks_title'),
        description: t('welcome.tasks_description'),
        icon: ListTodo,
        href: '/tasks',
    },
    {
        title: t('welcome.tags_title'),
        description: t('welcome.tags_description'),
        icon: Tags,
        href: '/tags',
    },
    {
        title: t('welcome.clients_title'),
        description: t('welcome.clients_description'),
        icon: Users,
        href: '/clients',
    },
    {
        title: t('welcome.time_tracking_title'),
        description: t('welcome.time_tracking_description'),
        icon: Clock,
        href: '/time-tracking',
    },
]);
</script>

<template>
    <section class="bg-muted/30 py-24 sm:py-32">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="mx-auto max-w-2xl text-center">
                <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {{ t('welcome.features_title') }}
                </h2>
                <p class="mt-4 text-lg text-muted-foreground">
                    {{ t('welcome.features_description') }}
                </p>
            </div>
            <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                <FeatureCard
                    v-for="feature in features"
                    :key="feature.title"
                    :title="feature.title"
                    :description="feature.description"
                    :icon="feature.icon"
                    :href="feature.href"
                />
            </div>
        </div>
    </section>
</template>
