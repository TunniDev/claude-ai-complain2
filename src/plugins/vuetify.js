// Vuetify 3 setup — ธีมสีเดิม + ฟอนต์ Prompt + ไอคอนผสม (mdi + FontAwesome)
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '../assets/css/fonts.css'

import { createVuetify } from 'vuetify'
import { th } from 'vuetify/locale'
import { aliases } from 'vuetify/iconsets/mdi'
import { mixed } from './iconset'

export default createVuetify({
  locale: {
    locale: 'th',
    fallback: 'en',
    messages: { th },
  },
  icons: {
    // ใช้ alias ภายในของ Vuetify (เช่น $dropdown, $sort, $checkboxOn) แบบ mdi
    // และ default set แบบผสม รองรับ mdi-* และ fas/far fa-* จาก template เดิม
    defaultSet: 'mixed',
    aliases,
    sets: { mixed },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#007BFF',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
        },
      },
    },
  },
})
