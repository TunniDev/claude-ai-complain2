<template>
  <div class="rte">
    <div class="rte-toolbar" v-if="editor">
      <button type="button" :class="{active: editor.isActive('bold')}" @click="editor.chain().focus().toggleBold().run()"><b>B</b></button>
      <button type="button" :class="{active: editor.isActive('italic')}" @click="editor.chain().focus().toggleItalic().run()"><i>I</i></button>
      <button type="button" :class="{active: editor.isActive('strike')}" @click="editor.chain().focus().toggleStrike().run()"><s>S</s></button>
      <span class="rte-sep"></span>
      <button type="button" :class="{active: editor.isActive('heading',{level:1})}" @click="editor.chain().focus().toggleHeading({level:1}).run()">H1</button>
      <button type="button" :class="{active: editor.isActive('heading',{level:2})}" @click="editor.chain().focus().toggleHeading({level:2}).run()">H2</button>
      <button type="button" :class="{active: editor.isActive('bulletList')}" @click="editor.chain().focus().toggleBulletList().run()">• List</button>
      <button type="button" :class="{active: editor.isActive('orderedList')}" @click="editor.chain().focus().toggleOrderedList().run()">1. List</button>
      <span class="rte-sep"></span>
      <button type="button" @click="editor.chain().focus().undo().run()">↶</button>
      <button type="button" @click="editor.chain().focus().redo().run()">↷</button>
    </div>
    <editor-content :editor="editor" class="rte-content" />
  </div>
</template>

<script>
// RichTextEditor — แทน @peepi/vuetify-tiptap (Vue 2) ด้วย @tiptap/vue-3
// v-model เป็น HTML string เหมือนเดิม
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
export default {
  components: { EditorContent },
  props: { modelValue: { type: String, default: '' } },
  emits: ['update:modelValue'],
  data: () => ({ editor: null }),
  watch: {
    modelValue(val) {
      if (!this.editor) return
      const isSame = this.editor.getHTML() === val
      if (!isSame) this.editor.commands.setContent(val || '', false)
    },
  },
  mounted() {
    this.editor = new Editor({
      content: this.modelValue || '',
      extensions: [StarterKit],
      onUpdate: () => { this.$emit('update:modelValue', this.editor.getHTML()) },
    })
  },
  beforeUnmount() {
    if (this.editor) this.editor.destroy()
  },
}
</script>

<style scoped>
.rte { border:1px solid #ccc; border-radius:4px; margin-top:8px; }
.rte-toolbar { display:flex; gap:4px; padding:6px; border-bottom:1px solid #eee; flex-wrap:wrap; align-items:center; }
.rte-toolbar button { padding:2px 8px; border:1px solid #ddd; background:#fff; border-radius:3px; cursor:pointer; min-width:30px; }
.rte-toolbar button.active { background:#003366; color:#fff; }
.rte-sep { width:1px; height:20px; background:#ddd; margin:0 4px; }
.rte-content { padding:8px; min-height:160px; text-align:left; }
:deep(.ProseMirror){ outline:none; min-height:150px; }
:deep(.ProseMirror p){ margin:0 0 8px; }
</style>
