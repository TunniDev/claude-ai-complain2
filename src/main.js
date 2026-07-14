import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'

// ── axios config (ย้ายมาจากโปรเจกต์เดิมแบบ 1:1) ──
axios.defaults.baseURL = ''
axios.defaults.headers.common = {
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
}
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers['Authorization'] = `Bearer ${token}`
  return config
})

const app = createApp(App)
app.config.globalProperties.$http = axios // เผื่อโค้ดเดิมเรียก this.$http
app.use(store)
app.use(router)
app.use(vuetify)
app.mount('#app')
