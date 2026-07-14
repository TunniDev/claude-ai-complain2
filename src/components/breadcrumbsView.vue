<template>
  <v-breadcrumbs :items="normalized" class="breadcrumbs"></v-breadcrumbs>
</template>
<script>
  export default {
    props: ['items'],
    computed: {
      // v3 v-breadcrumbs ใช้ key 'title'; ของเดิมส่งมาเป็น 'text' → normalize ให้รองรับทั้งคู่
      normalized() {
        return (this.items || []).map(i => ({ ...i, title: i.title ?? i.text }))
      }
    }
  }
</script>
<style>
.breadcrumbs{
  padding: 0 0 12px 12px;
}
</style>
