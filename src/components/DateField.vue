<template>
  <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" min-width="290px">
    <template v-slot:activator="{ props }">
      <v-text-field
        :model-value="displayDate"
        :label="label"
        readonly
        v-bind="props"
        density="compact"
        variant="outlined"
        clearable
        prepend-icon="mdi-calendar"
        @click:clear="clear"
      ></v-text-field>
    </template>
    <v-date-picker
      :model-value="pickerValue"
      :min="minDate"
      hide-header
      @update:model-value="onPick"
    ></v-date-picker>
  </v-menu>
</template>

<script>
// DateField — ห่อ v-menu + v-date-picker (Vuetify 3)
// modelValue เป็น string 'YYYY-MM-DD' เพื่อให้ payload ตรงกับ backend เดิม
// แสดงผลในช่องเป็นวันที่ไทย (readonly)
export default {
  props: {
    modelValue: { default: null },
    label: { type: String, default: '' },
    min: { default: null },
  },
  emits: ['update:modelValue'],
  data: () => ({ menu: false }),
  computed: {
    minDate() {
      if (!this.min) return undefined
      const d = new Date(this.min)
      return isNaN(d) ? undefined : d
    },
    pickerValue() {
      if (!this.modelValue) return null
      const d = new Date(this.modelValue)
      return isNaN(d) ? null : d
    },
    displayDate() {
      if (!this.modelValue) return ''
      const d = new Date(this.modelValue)
      if (isNaN(d)) return ''
      return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })
    },
  },
  methods: {
    toISO(d) {
      const dt = new Date(d)
      const y = dt.getFullYear()
      const m = String(dt.getMonth() + 1).padStart(2, '0')
      const day = String(dt.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    },
    onPick(val) {
      this.$emit('update:modelValue', val ? this.toISO(val) : null)
      this.menu = false
    },
    clear() {
      this.$emit('update:modelValue', null)
    },
  },
}
</script>
