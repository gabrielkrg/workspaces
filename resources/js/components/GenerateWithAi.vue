<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Sparkle } from 'lucide-vue-next'
import { useForm } from '@inertiajs/vue3'
import { ref } from 'vue'
import Textarea from './ui/textarea/Textarea.vue'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import axios from 'axios'

const props = defineProps({
    kanban: Object,
    columns: Array
})

const emit = defineEmits(['submit'])

const cards = ref([])

const isOpen = ref(false)
const generatingAi = ref(false)

const generateWithAiForm = ref({
    content: ''
})

const bulkCardsForm = useForm({
    kanban_id: props.kanban?.id || null,
    column_id: props.columns[0]?.id || null,
    cards: []
})

const generateWithAi = async () => {
    if (generateWithAiForm.value.content !== '') {
        generatingAi.value = true

        try {
            const response = await axios.post(
                route('api.generate-with-ai'),
                {
                    content: generateWithAiForm.value.content,
                },
            );

            cards.value = response.data || [];
        } catch (error) {
            console.error(error)
        } finally {
            generatingAi.value = false
        }
    }
}

const submitCards = () => {
    if (cards.value.length === 0) return

    bulkCardsForm.cards = cards.value.map(card => ({
        title: card.name,
        description: card.description,
        order: 0,
    }))


    bulkCardsForm.post(route('cards.bulk'), {
        onSuccess: () => {
            emit('submit', bulkCardsForm.column_id)
            reset()
            isOpen.value = false
        }
    })
}

const deleteCard = (index: number) => {
    cards.value.splice(index, 1)
}

const reset = () => {
    generateWithAiForm.value.content = ''
    cards.value = []
    bulkCardsForm.cards = []
}


</script>

<template>
    <Dialog v-model:open="isOpen">
        <Button
            class="cursor-pointer px-4 py-1 font-bold text-white text-sm transition duration-200 hover:brightness-110"
            style="background: linear-gradient(90deg, #4B0082 0%, #90EE90 100%);" @click="isOpen = true">
            Generate with AI
            <Sparkle />
        </Button>
        <DialogContent class="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <form @submit.prevent="generateWithAi" v-if="cards.length === 0">
                <DialogHeader>
                    <DialogTitle>Generate with AI</DialogTitle>
                    <DialogDescription>
                        Write something, the AI will interpret the content and generate a list based on it.
                    </DialogDescription>
                </DialogHeader>
                <div class="grid gap-4 py-4">
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="content" class="text-right">
                            Content
                        </Label>
                        <Textarea id="content" v-model="generateWithAiForm.content" class="col-span-4" rows="5" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" class="cursor-pointer" :disabled="generatingAi">
                        {{ generatingAi ? 'Generating...' : 'Generate' }}
                    </Button>
                </DialogFooter>
            </form>
            <div v-else class="grid gap-4">
                <div class="grid grid-cols-4 items-center border-b pb-4">
                    <Label for="column"> Column </Label>
                    <Select v-model="bulkCardsForm.column_id" class="col-span-3">
                        <SelectTrigger id="column" class="w-full">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectItem v-for="column in columns" :key="column.id" :value="column.id">
                                {{ column.name }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div v-for="(card, index) in cards" :key="index" class="grid gap-4 border-b pb-4">
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label :for="`name-${index}`" class="text-right">
                            Title
                        </Label>
                        <Input :id="`name-${index}`" v-model="cards[index].name" class="col-span-3" />
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label :for="`description-${index}`" class="text-right">
                            Description
                        </Label>
                        <Textarea :id="`description-${index}`" v-model="cards[index].description" class="col-span-3" />
                    </div>
                    <div class="flex justify-end">
                        <Dialog>
                            <DialogTrigger as-child>
                                <Button variant="destructive" class="cursor-pointer">
                                    Delete
                                </Button>
                            </DialogTrigger>
                            <DialogContent class="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Delete card</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to delete this card?
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose as-child>
                                        <Button type="button" variant="outline" class="cursor-pointer">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button @click="deleteCard(index)" class="cursor-pointer" variant="destructive">
                                        Delete
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div class="flex justify-end gap-4">
                    <Dialog>
                        <DialogTrigger as-child class="flex justify-end">
                            <Button variant="destructive" class="cursor-pointer">
                                Reset
                            </Button>
                        </DialogTrigger>
                        <DialogContent class="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Reset cards</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to reset the cards?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose as-child>
                                    <Button type="button" variant="outline" class="cursor-pointer">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button @click="reset" class="cursor-pointer" variant="destructive">
                                    Reset
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Button @click="submitCards" :disabled="cards.length === 0" class="cursor-pointer">Save</Button>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>
