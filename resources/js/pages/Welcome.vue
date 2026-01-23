<script setup lang="ts">
import { Head, Link, usePage } from '@inertiajs/vue3';
import HeroSection from '@/components/welcome/HeroSection.vue';
import FeaturesSection from '@/components/welcome/FeaturesSection.vue';
import { Button } from '@/components/ui/button';
import { computed } from 'vue';
import type { SharedData } from '@/types';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import { useTranslation } from '@/hook/use-translation';

const page = usePage<SharedData>();
const { t } = useTranslation();

const isAuthenticated = computed(() => {
    const auth = page.props.auth as { user?: any } | undefined;
    return !!auth?.user;
});
</script>

<template>

    <Head :title="t('welcome.head_title')">
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
    </Head>

    <div class="flex min-h-screen flex-col bg-background">
        <!-- Header -->
        <header class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div class="container flex h-16 items-center justify-between px-4">
                <div class="flex items-center gap-2">
                    <Link :href="route('home')" class="flex items-center gap-2 font-semibold text-foreground">
                        <AppLogoIcon class="size-8 fill-current text-white" />
                        <span>Workspaces</span>
                    </Link>
                </div>
                <nav class="flex items-center gap-4">
                    <template v-if="isAuthenticated">
                        <Link :href="route('dashboard')">
                            <Button variant="ghost">{{ t('welcome.header_dashboard') }}</Button>
                        </Link>
                    </template>
                    <template v-else>
                        <Link :href="route('login')">
                            <Button variant="ghost">{{ t('welcome.header_login') }}</Button>
                        </Link>
                        <Link :href="route('register')">
                            <Button>{{ t('welcome.header_register') }}</Button>
                        </Link>
                    </template>
                </nav>
            </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1">
            <HeroSection :title="t('welcome.title')" :description="t('welcome.description')"
                :cta-text="isAuthenticated ? t('welcome.cta_authenticated') : t('welcome.cta_guest')"
                :cta-href="isAuthenticated ? route('dashboard') : route('register')" />
            <FeaturesSection />
        </main>

        <!-- Footer -->
        <footer class="border-t bg-muted/30 py-12">
            <div class="container mx-auto px-4 text-center text-sm text-muted-foreground">
                <p>&copy; {{ new Date().getFullYear() }} Workspaces. {{ t('welcome.footer_copyright') }}</p>
            </div>
        </footer>
    </div>
</template>
