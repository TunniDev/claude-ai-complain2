<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
export default { name: 'App' }
</script>

<style>
#app {
  font-family: 'Prompt', sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

/* ให้ SweetAlert2 แสดงอยู่หน้า v-dialog ของ Vuetify เสมอ (Vuetify overlay z-index ~2400) */
.swal2-container {
  z-index: 99999 !important;
}

/* แถบหัวข้อหน้า (หน้าหลัก/ติดต่อเรา/ประชาสัมพันธ์) — พื้นน้ำเงิน ตัวอักษรขาว ตามตัวอย่าง */
.head-topic {
  background: #003366;
}
.head-left {
  color: #ffffff;
  font-size: 24px;
  padding: 1rem 0;
  display: inline-block;
}
</style>
