<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';

const props = defineProps({
    task: Object,
    clients: Object,
});

const emit = defineEmits(['close']);

const form = useForm({
    title: props.task?.title ?? '',
    description: props.task?.description ?? '',
});

const submit = () => {
    form.put(route('tasks.update', props.task?.id), {
        onSuccess: () => {
            emit('close');
            form.reset();
        },
    });
};

const closeEditModal = () => {
    emit('close');
};
</script>
<template>
    <!-- edit modal -->
    <div class="fixed inset-0 z-50 flex items-center justify-end">
        <div class="absolute inset-0 bg-black opacity-60" @click="closeEditModal"></div>
        <div
            class="border-sidebar-border/70 dark:border-sidebar-border bg-background relative z-50 h-screen w-4/5 rounded-l-xl rounded-bl-xl border md:w-2/5"
        >
            <div class="p-5">
                <h2 class="text-lg font-bold text-gray-800 dark:text-gray-100">Edit Task</h2>
                <!-- <p class="text-gray-800 dark:text-gray-100">Este texto é escuro no tema claro e claro no tema escuro.</p> -->

                <form @submit.prevent="submit" class="space-y-4">
                    <div>
                        <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
                        <input
                            id="title"
                            v-model="form.title"
                            type="text"
                            class="border-sidebar-border/70 dark:border-sidebar-border bg-background mt-1 block w-full rounded border p-2 dark:text-white"
                        />
                        <p v-if="form.errors.title" class="mt-1 text-sm text-red-500">{{ form.errors.title }}</p>
                    </div>

                    <div>
                        <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
                        <textarea
                            id="description"
                            v-model="form.description"
                            class="border-sidebar-border/70 dark:border-sidebar-border bg-background mt-1 block w-full rounded border p-2 dark:text-white"
                        />
                        <p v-if="form.errors.description" class="mt-1 text-sm text-red-500">{{ form.errors.description }}</p>
                    </div>

                    <button
                        type="submit"
                        :disabled="form.processing"
                        class="rounded bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {{ form.processing ? 'Salvando...' : 'Salvar' }}
                    </button>
                </form>
            </div>
        </div>
    </div>
    <!-- edit modal -->
</template>
