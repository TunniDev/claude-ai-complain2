# complaint_vue_v3

ระบบรับเรื่องร้องเรียนทุจริต กรมบัญชีกลาง — เวอร์ชันอัปเกรด (Vue 3 + Vuetify 3 + Vite)
อยู่ระหว่างการ migrate จากโปรเจกต์เดิม `complaint_vue` (Vue 2) — ดู `MIGRATION_*.md` ในโฟลเดอร์เดิม

## รันในเครื่อง
```bash
npm install
npm run dev        # http://localhost:5173 ; proxy /api -> http://10.10.10.164
npm run build  ตอน     up production
```
ต่อ mock backend แทน: `VITE_API_TARGET=http://localhost:3001 npm run dev`

## สถานะ
- [x] ช่วง 0 — โครงโปรเจกต์ + proxy + assets (หน้า HealthCheck ทดสอบ /api)
- [x] ช่วง 1 — แกนแอป (main/router/store เต็ม + stub ทุกหน้า)
- [x] ช่วง 2 — Vuetify 3 theme/ฟอนต์ Prompt ครบน้ำหนัก/ไอคอน mdi+FontAwesome
- [x] ช่วง 3 — ย้าย component รายหน้า
  - [x] Wave 1: Login (backoffice/cgd/user) + Forgot/Reset password
  - [x] Wave 2: Layout/Home/Contact/MainView/MainDetail + components (เลื่อน ComplainView/EditProfile ไป Wave 4)
  - [x] Wave 3: data-table 5 หน้า (follow x2, receive, personnel, register) + selectStatus (เลื่อน reportComplain ไป Wave 5/8)
  - [x] Wave 4: RequestForm(stepper) + ComplainView + EditProfile + step components + DateField/TimeField กลาง
  - [x] Wave 5: datePickers + exportExcel(SheetJS) + reportComplain
  - [x] Wave 6: detailComplain + UserDetail + ReceiveDetail + FollowDetail (user+backoffice 1,499)
  - [x] Wave 7: manage 5 หน้า + RichTextEditor (tiptap vue-3 แทน @peepi/vuetify-tiptap)
  - [x] Wave 8: UserForm + RegisterForm + ReportView

## ตรวจล่า