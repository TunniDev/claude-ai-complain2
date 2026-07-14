<template>
  <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" min-width="290px">
    <template v-slot:activator="{ props }">
      <v-text-field
        :model-value="modelValue"
        :label="label"
        readonly
        v-bind="props"
        density="compact"
        variant="outlined"
        clearable
        prepend-icon="mdi-clock-time-four-outline"
        @click:clear="$emit('update:modelValue', null)"
      ></v-text-field>
    </template>
    <v-time-picker
      :model-value="modelValue"
      :min="min || undefined"
      format="24hr"
      @update:model-value="$emit('update:modelValue', $event)"
    ></v-time-picker>
  </v-menu>
</template>

<script>
// TimeField — ห่อ v-menu + v-time-picker (Vuetify 3) คืนค่า string 'HH:mm'
export default {
  props: {
    modelValue: { default: null },
    label: { type: String, default: '' },
    min: { default: null },
  },
  emits: ['update:modelValue'],
  data: () => ({ menu: false }),
}
</script>
