import { h } from 'vue'

// icon set ผสม: รองรับทั้ง 'mdi-xxx' และ 'fas fa-xxx' / 'far fa-xxx' โดยไม่ต้องใส่ prefix
// - ถ้าขึ้นต้นด้วย mdi- จะใส่ base class 'mdi' ให้ (เหมือน iconset mdi เดิม)
// - กรณีอื่น (fontawesome ฯลฯ) ส่ง class ผ่านตรง ๆ ให้ FontAwesome CSS เรนเดอร์
const mixedIconComponent = (props) => {
  const icon = String(props.icon ?? '')
  const isMdi = icon.startsWith('mdi-')
  return h(props.tag || 'i', {
    class: [isMdi ? 'mdi' : null, icon],
  })
}

export const mixed = { component: mixedIconComponent }
