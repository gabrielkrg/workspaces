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

const features = [
    {
        title: 'Dashboard',
        description: 'Visão geral completa do seu workspace com estatísticas e métricas importantes.',
        icon: LayoutGrid,
        href: '/dashboard',
    },
    {
        title: 'Kanban',
        description: 'Organize projetos com quadros Kanban personalizáveis, colunas e cards arrastáveis.',
        icon: SquareKanban,
        href: '/kanban',
    },
    {
        title: 'Tasks',
        description: 'Gerencie tarefas com repetição, destaques, tags e muito mais.',
        icon: ListTodo,
        href: '/tasks',
    },
    {
        title: 'Tags',
        description: 'Organize e categorize seus itens com tags personalizadas e cores.',
        icon: Tags,
        href: '/tags',
    },
    {
        title: 'Clients',
        description: 'Mantenha um registro completo dos seus clientes e seus projetos.',
        icon: Users,
        href: '/clients',
    },
    {
        title: 'Time Tracking',
        description: 'Acompanhe o tempo gasto em tarefas e projetos com precisão.',
        icon: Clock,
        href: '/time-tracking',
    },
];
</script>

<template>
    <section class="bg-muted/30 py-24 sm:py-32">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="mx-auto max-w-2xl text-center">
                <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Recursos poderosos para sua produtividade
                </h2>
                <p class="mt-4 text-lg text-muted-foreground">
                    Tudo que você precisa para gerenciar seu trabalho de forma eficiente
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
