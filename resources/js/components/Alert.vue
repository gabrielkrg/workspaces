<script setup lang="ts">
import { CheckCircleIcon, XCircleIcon } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
    type: {
        type: String,
        default: 'success', // ou 'error'
    },
    title: {
        type: String,
        default: 'Success',
    },
    message: {
        type: String,
        required: true,
    },
});

const visible = ref(true);

onMounted(() => {
    setTimeout(() => {
        visible.value = false;
    }, 5000);
});

const icon = computed(() => {
    return props.type === 'error' ? XCircleIcon : CheckCircleIcon;
});

const textColor = computed(() => {
    return props.type === 'error' ? 'text-red-600' : 'text-green-600';
});
</script>

<template>
    <transition name="fade">
        <div
            v-if="visible && message"
            class="fixed top-6 right-6 z-50 w-80 rounded-lg border-l-4 bg-white shadow-lg"
            :class="{
                'border-green-500': type === 'success',
                'border-red-500': type === 'error',
            }"
        >
            <div class="flex items-start justify-between p-4">
                <div class="flex items-start gap-3">
                    <component
                        :is="icon"
                        :class="{
                            'text-green-500': type === 'success',
                            'text-red-500': type === 'error',
                        }"
                        class="mt-1 h-6 w-6"
                    />
                    <div>
                        <p class="font-semibold" :class="textColor">{{ title }}</p>
                        <p class="text-sm text-gray-600">{{ message }}</p>
                    </div>
                </div>
                <button @click="visible = false" class="ml-4 text-sm tracking-wide text-gray-400 uppercase hover:text-gray-600">Close</button>
            </div>
        </div>
    </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
