<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from '@/components/ui/button'
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Link as LinkIcon,
    Image as ImageIcon,
} from 'lucide-vue-next'
import { watch } from 'vue'

const props = defineProps<{
    modelValue: string
    editable?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

const editor = useEditor({
    content: props.modelValue,
    editable: props.editable,
    extensions: [
        StarterKit,
        Link.configure({
            openOnClick: false,
            HTMLAttributes: {
                class: 'text-blue-500 hover:underline',
            },
        }),
        Image,
        Placeholder.configure({
            placeholder: 'Start writing...',
        }),
    ],
    onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML())
    },
})

// Watch for external content changes
watch(() => props.modelValue, (newContent) => {
    const isSame = editor.value?.getHTML() === newContent
    if (editor.value && !isSame) {
        editor.value.commands.setContent(newContent, false)
    }
})

// Toolbar actions
const addLink = () => {
    const url = window.prompt('Enter URL')
    if (url) {
        editor.value?.chain().focus().setLink({ href: url }).run()
    }
}

const addImage = () => {
    const url = window.prompt('Enter image URL')
    if (url) {
        editor.value?.chain().focus().setImage({ src: url }).run()
    }
}
</script>

<template>
    <div
        class="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min p-4">
        <!-- Toolbar -->
        <div class="border-b p-2 flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" :class="{ 'bg-muted': editor?.isActive('bold') }"
                @click="editor?.chain().focus().toggleBold().run()">
                <Bold class="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" :class="{ 'bg-muted': editor?.isActive('italic') }"
                @click="editor?.chain().focus().toggleItalic().run()">
                <Italic class="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" :class="{ 'bg-muted': editor?.isActive('bulletList') }"
                @click="editor?.chain().focus().toggleBulletList().run()">
                <List class="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" :class="{ 'bg-muted': editor?.isActive('orderedList') }"
                @click="editor?.chain().focus().toggleOrderedList().run()">
                <ListOrdered class="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" :class="{ 'bg-muted': editor?.isActive('link') }" @click="addLink">
                <LinkIcon class="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" @click="addImage">
                <ImageIcon class="h-4 w-4" />
            </Button>
        </div>

        <!-- Editor Content -->
        <EditorContent :editor="editor"
            class="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none p-4 min-h-[400px]" />
    </div>
</template>

<style>
.ProseMirror {
    min-height: 400px;
    outline: none;
}

.ProseMirror p.is-editor-empty:first-child::before {
    color: #9ca3af;
    /* text-gray-400 */
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
}

.ProseMirror ul,
.ProseMirror ol {
    padding-left: 1rem;
}

.ProseMirror ul {
    list-style-type: disc;
}

.ProseMirror ol {
    list-style-type: decimal;
}

.ProseMirror a {
    color: #3b82f6;
    /* text-blue-500 */
    text-decoration: none;
}

.ProseMirror a:hover {
    text-decoration: underline;
}

.ProseMirror img {
    max-width: 100%;
    height: auto;
}
</style>
