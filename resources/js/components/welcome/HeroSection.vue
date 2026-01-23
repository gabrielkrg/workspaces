<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/vue3';
import { ArrowRight } from 'lucide-vue-next';

defineProps<{
    title?: string;
    description?: string;
    ctaText?: string;
    ctaHref?: string;
}>();
</script>

<template>
    <section class="relative overflow-hidden py-24 sm:py-32">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="mx-auto max-w-2xl text-center">
                <h1 class="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                    {{
                        title || 'Gerencie seu trabalho com eficiência'
                    }}
                </h1>
                <p class="mt-6 text-lg leading-8 text-muted-foreground">
                    {{
                        description ||
                        'Uma plataforma completa para gerenciar tarefas, projetos, clientes e tempo detrabalho.'
                    }}
                </p>
                <div v-if="ctaHref" class="mt-10 flex items-center justify-center gap-x-6">
                    <Link :href="ctaHref">
                        <Button size="lg" class="group">
                            {{ ctaText || 'Começar agora' }}
                            <ArrowRight class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    </section>
</template>
