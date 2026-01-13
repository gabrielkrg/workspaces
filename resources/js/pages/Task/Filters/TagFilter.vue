<script setup lang="ts">
import { ref, computed } from 'vue';
import {
    Combobox,
    ComboboxAnchor,
    ComboboxInput,
    ComboboxList,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxItem,
} from '@/components/ui/combobox';
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input';
import { cn } from '@/lib/utils';
import { useFilter } from 'reka-ui';

const props = defineProps<{
    modelValue: string[],
    tags: { name: string, color: string }[]
}>();

const emit = defineEmits<{
    'update:modelValue': [value: string[]],
    'submit': [] // Used if needed, though parent watches modelValue change
}>();

const openSearchTermFilter = ref(false);
const searchTermFilter = ref('');
const { contains } = useFilter({ sensitivity: 'base' });

const filteredTagsFilter = computed(() => {
    const options = props.tags.filter(i => !props.modelValue.includes(i.name));
    return searchTermFilter.value ? options.filter(option => contains(option.name, searchTermFilter.value)) : options;
});

const onUpdateModelValue = (val: string[]) => {
    emit('update:modelValue', [...val]);
    // The parent watcher will handle submission, but we can emit if needed
};
</script>

<template>
    <div class="flex flex-col gap-1.5 w-full md:w-auto md:min-w-[250px] flex-1">
        <Combobox :model-value="modelValue" @update:model-value="onUpdateModelValue" v-model:open="openSearchTermFilter"
            :ignore-filter="true">
            <ComboboxAnchor as-child>
                <TagsInput :model-value="modelValue" @update:model-value="onUpdateModelValue"
                    :class="cn('p-0 gap-0 w-full bg-input/30 min-h-[36px]')">
                    <div :class="['flex gap-2 flex-wrap items-center', modelValue.length > 0 ? 'p-1' : '']">
                        <TagsInputItem v-for="tag in modelValue" :key="tag" :value="tag">
                            <TagsInputItemText />
                            <TagsInputItemDelete />
                        </TagsInputItem>
                    </div>

                    <ComboboxInput v-model="searchTermFilter" as-child>
                        <TagsInputInput placeholder="Filter tags..."
                            :class="cn('min-w-[100px] w-full p-0 px-2 focus-visible:ring-0 h-auto border-none shadow-none text-sm')"
                            @keydown.enter.prevent />
                    </ComboboxInput>
                </TagsInput>

                <ComboboxList class="w-[--reka-popper-anchor-width]">
                    <ComboboxEmpty />
                    <ComboboxGroup>
                        <ComboboxItem v-for="tag in filteredTagsFilter" :key="tag.name" :value="tag.name"
                            @select.prevent="(ev) => {
                                if (typeof ev.detail.value === 'string') {
                                    searchTermFilter = '';
                                    const newTags = [...modelValue, ev.detail.value];
                                    emit('update:modelValue', newTags);
                                }

                                if (filteredTagsFilter.length === 0) {
                                    openSearchTermFilter = false;
                                }
                            }">
                            {{ tag.name }}
                        </ComboboxItem>
                    </ComboboxGroup>
                </ComboboxList>
            </ComboboxAnchor>
        </Combobox>
    </div>
</template>
