<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

interface Props {
    calendarData: {
        currentDate: string;
        currentMonth: string;
        weekDays: string[];
        days: (number | null)[];
    }
}

const props = defineProps<Props>();

// const props = defineProps({
//     calendarData: Object,
// });


const currentDate = ref(new Date(props.calendarData.currentDate));
const weekDays = props.calendarData.weekDays;

const currentMonth = computed(() => {
    return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' });
});

const daysInMonth = computed(() => props.calendarData.days);

const previousMonth = () => {
    currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() - 1,
        1
    );
};

const nextMonth = () => {
    currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() + 1,
        1
    );
};

const onSlideChange = (swiper: any) => {
    if (swiper.activeIndex === 0) {
        previousMonth();
    } else if (swiper.activeIndex === 2) {
        nextMonth();
    }
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Calendar',
        href: '/calendar',
    },
];



</script>

<template>

    <Head title="Calendar" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full w-full gap-4 rounded-xl p-4 overflow-x-hidden">
            <div class="w-full rounded-lg border bg-card text-card-foreground shadow-sm">
                <div class="p-4 flex items-center justify-center border-b">
                    <h2 class="text-xl font-semibold text-foreground">{{ currentMonth }}</h2>
                </div>
                <swiper :slides-per-view="1" :space-between="50" :initial-slide="1" @slideChange="onSlideChange"
                    class="w-full">
                    <swiper-slide>
                        <div class="p-0">
                            <div class="grid grid-cols-7 border-t border-l">
                                <div v-for="day in weekDays" :key="day"
                                    class="h-12 flex items-center justify-center text-sm font-semibold bg-muted text-muted-foreground border-b border-r uppercase">
                                    {{ day }}
                                </div>
                                <div v-for="(day, index) in daysInMonth" :key="index"
                                    class="h-16 flex items-center justify-center text-base border-b border-r"
                                    :class="{ 'opacity-0': day === null, 'bg-background': day !== null }">
                                    {{ day }}
                                </div>
                            </div>
                        </div>
                    </swiper-slide>
                    <swiper-slide>
                        <div class="p-0">
                            <div class="grid grid-cols-7 border-t border-l">
                                <div v-for="day in weekDays" :key="day"
                                    class="h-12 flex items-center justify-center text-sm font-semibold bg-muted text-muted-foreground border-b border-r uppercase">
                                    {{ day }}
                                </div>
                                <div v-for="(day, index) in daysInMonth" :key="index"
                                    class="h-16 flex items-center justify-center text-base border-b border-r"
                                    :class="{ 'opacity-0': day === null, 'bg-background': day !== null }">
                                    {{ day }}
                                </div>
                            </div>
                        </div>
                    </swiper-slide>
                    <swiper-slide>
                        <div class="p-0">
                            <div class="grid grid-cols-7 border-t border-l">
                                <div v-for="day in weekDays" :key="day"
                                    class="h-12 flex items-center justify-center text-sm font-semibold bg-muted text-muted-foreground border-b border-r uppercase">
                                    {{ day }}
                                </div>
                                <div v-for="(day, index) in daysInMonth" :key="index"
                                    class="h-16 flex items-center justify-center text-base border-b border-r"
                                    :class="{ 'opacity-0': day === null, 'bg-background': day !== null }">
                                    {{ day }}
                                </div>
                            </div>
                        </div>
                    </swiper-slide>
                </swiper>
            </div>
        </div>
    </AppLayout>
</template>
