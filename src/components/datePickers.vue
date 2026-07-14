<template>
  <v-row>
    <v-col>
      <DateField v-model="date" label="วันที่เริ่มต้น" />
    </v-col>
    <v-col>
      <DateField v-model="endDate" :min="date" label="วันที่สิ้นสุด" />
    </v-col>
  </v-row>
</template>

<script>
import DateField from '@/components/DateField.vue'
export default {
  components: { DateField },
  props: ['show_date'],
  data: () => ({
    date: null,
    endDate: null,
  }),
  watch: {
    show_date(){
      if (this.show_date) {
        this.date = this.show_date
      }
    },
    date(){
      this.$emit('change_date', this.date)
    },
    endDate(){
      this.$emit('change_end_date', this.endDate)
    },
  },
}
</script>
