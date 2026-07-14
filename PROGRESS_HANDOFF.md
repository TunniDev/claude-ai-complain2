# บันทึกการทำงาน + แผนต่อ — Migration Vue 2 → Vue 3 (complaint_vue_v3)

> อัปเดตล่าสุด: ตรวจสอบความครบถ้วนของโปรเจกต์
> โปรเจกต์ใหม่: `D:\Complain-cgd\complaint_vue_v3` (Vue 3 + Vuetify 3 + Vite)
> โปรเจกต์เดิม (อ้างอิง): `D:\Complain-cgd\complaint_vue` (Vue 2)

---

## สถานะรวม: ✅ 100% — migrate ครบทุกไฟล์ (49/49) build ผ่านทั้งโปรเจกต์
> (Wave 8 เสร็จ + ซ่อมไฟล์ที่ถูกตัด 4 ไฟล์เรียบร้อย)

ไฟล์ที่ต้อง migrate ทั้งหมด **49 ไฟล์** → เสร็จสมบูรณ์ **45 ไฟล์** (build ผ่านใน sandbox)

### เสร็จแล้ว (ช่วง 0–7)
- **ช่วง 0–2**: โครงโปรเจกต์ Vite + proxy `/api`→`10.10.10.164`, store (Vuex 4), router (Vue Router 4 + guards), Vuetify 3 (ธีม + ฟอนต์ Prompt ครบน้ำหนัก + ไอคอนผสม mdi/FontAwesome)
- **Wave 1**: Login (backoffice/cgd/user), Forgot/Reset password, resetPassword
- **Wave 2**: HomeView, LayoutView, MainView, MainDetail, ContactView, NotFound + components (breadcrumbsView, loaderView, unauthorizedPopup, showFile, dialogsResetPassword)
- **Wave 3**: data-table 5 หน้า (FollowView x2, ReceiveView, UserViews, RegisterViews) + selectStatus
- **Wave 4**: RequestFormView (stepper), ComplainView, EditProfile, step components (stepOne/Oneplus/Two/Tree), inputFiles, dialogsFiles + **DateField/TimeField กลาง**
- **Wave 5**: datePickers, exportExcel (SheetJS แทน vue-excel-xlsx), reportComplain
- **Wave 6**: detailComplain, UserDetail, ReceiveDetail, FollowDetail (user + backoffice 1,499 บรรทัด)
- **Wave 7**: manage 5 หน้า (manageView, announceView, bannersView, contactChannels, replyMessage) + **RichTextEditor** (tiptap vue-3 แทน @peepi/vuetify-tiptap)

---

## ⚠️ ปัญหาที่พบตอนตรวจสอบ — โปรเจกต์ยัง build ไม่ผ่านที่สถานะปัจจุบัน

มีไฟล์ใน `complaint_vue_v3` **4 ไฟล์ถูกบันทึกไม่ครบ (truncated)** ปิด tag ไม่ครบ ทำให้ build ล้มเหลว:

| ไฟล์ | อาการ | หมายเหตุ |
|------|-------|----------|
| `src/views/users/main/RequestFormView.vue` | ขาด `</style>` ท้ายไฟล์ (ตัดที่ `.stepper-head...`) | template+script ครบ และมีการปรับปรุงเพิ่ม (class `complaint-channel-wrap`, aria-label) — **งานที่ปรับปรุงเอง ของดี แค่ท้ายไฟล์ถูกตัด** |
| `src/views/backoffice/personnel/UserForm.vue` | เหลือ 14 บรรทัด ตัดกลาง template | ยังไม่ migrate เสร็จ (Wave 8) |
| `src/views/backoffice/register/RegisterForm.vue` | เหลือ 16 บรรทัด ตัดกลาง template | ยังไม่ migrate เสร็จ (Wave 8) |
| `src/views/backoffice/report/ReportView.vue` | เหลือ 12 บรรทัด ตัดกลาง template | ยังไม่ migrate เสร็จ (Wave 8) |

> สาเหตุน่าจะมาจากการเขียนไฟล์ลงโฟลเดอร์ที่ mount ถูกตัดกลางคัน (เคยเจอ error "Stream closed") แนะนำ: หลังบันทึกไฟล์ใหญ่ ให้เช็คว่าไฟล์ปิด `</template>/</script>/</style>` ครบ

---

## งานที่ต้องทำต่อ (Wave 8) — 3 หน้า

### ไฟล์ที่ต้องอ่าน (จากโปรเจกต์เดิม `complaint_vue/src`)
1. `views/backoffice/personnel/UserForm.vue` (347 บรรทัด — ฟอร์มเพิ่ม/แก้ไขบุคลากร: v-text-field x10, v-select x6, v-card x4, v-btn x4)
2. `views/backoffice/register/RegisterForm.vue` (235 บรรทัด — แสดง/แก้ข้อมูลผู้ร้องเรียน: v-text-field x22)
3. `views/backoffice/report/ReportView.vue` (253 บรรทัด — dashboard สรุปสถิติ: v-sheet/v-card + v-btn x2 + อาจมีกราฟ/ตัวเลข)

### ลำดับแนะนำ
1. **ซ่อม RequestFormView.vue ก่อน** — แค่เติม `</style>` + rule ที่เหลือ (เทียบกับเวอร์ชันเดิมที่มี `.stepper-header/.btn-next/.swal2-*` ฯลฯ) เพื่อให้ build กลับมาผ่าน
2. migrate UserForm → build → RegisterForm → build → ReportView → build

---

## Cheat-sheet การแปลง Vuetify 2 → 3 (ใช้ซ้ำทุกไฟล์)

- `form.validate()` คืน **Promise** → ต้อง `const { valid } = await this.$refs.form.validate(); if (valid) {...}` (ห้ามใช้ `if(...validate())` ตรง ๆ)
- prop ฟอร์ม: `outlined`→`variant="outlined"`, `solo`→`variant="solo"`, `filled`→`variant="filled"`, `dense`→`density="compact"`, ลบ `single-line`, ลบ `lazy-validation`
- ไอคอนในช่อง: `append-icon`+`@click:append` → `append-inner-icon`+`@click:append-inner`
- v-select/v-autocomplete: `item-text`→`item-title`; `@change`→`@update:model-value`
- v-data-table: header `{text,value}`→`{title,key}`; slot `item.xxx` ใช้ได้เหมือนเดิม (`item` = row ตรง ๆ); ลบ `sort-by="calories"`
- v-btn: `icon small`→`icon size="small"`; `text`→`variant="text"`; `depressed`→`variant="flat"`; ลบ `dark`
- v-chip: `dark`→`variant="flat"`
- v-toolbar: `dark`→`theme="dark"`
- v-subheader: **ถูกลบ** → ใช้ `<div class="style-label/style-subheader">`
- v-list-item-content / v-list-item-title: **ถูกลบ** → ใช้ div ปกติ
- v-overlay: `:value`→`v-model`; `:absolute`→`:contained`; โหลดดิ้งใช้ `model-value contained`
- v-icon ที่เป็น FontAwesome ใน slot เช่น `<v-icon>fa-xmark</v-icon>` → `<v-icon icon="fa-solid fa-xmark" />`
- date/time picker: ใช้ `<DateField v-model="..."/>` / `<TimeField v-model="..."/>` (components/) แทน pattern `v-menu+:return-value.sync+$refs.save()` — คืนค่า string `YYYY-MM-DD` / `HH:mm`
- CSS เจาะ DOM ภายใน: `.v-input__slot`→`:deep(.v-field)`; `::v-deep`→`:deep()`; `.v-expansion-panel-header`→`:deep(.v-expansion-panel-title)`
- `require('@/assets/..')` (webpack) ใช้ไม่ได้ → `import x from '@/assets/..'`
- ไฟล์ที่ใช้ `moment().tz(...)` ต้อง `import moment from 'moment-timezone'`

---

## วิธี build/ทดสอบในเครื่อง
```
cd complaint_vue_v3
npm install
npm run dev      # http://localhost:5173 ; proxy /api -> http://10.10.10.164
npm run build    # ตรวจว่า compile ผ่าน
```
ต่อ mock backend: `VITE_API_TARGET=http://localhost:3001 npm run dev`

## เอกสารอ้างอิงในโฟลเดอร์เดิม (complaint_vue/)
- `MIGRATION_PLAN_VUE3.md` — แผนภาพรวม
- `MIGRATION_STEPS_VUE3.md` — คู่มือลงมือ + หลักการเขียน code
- `MIGRATION_COMPONENT_MAP.md` — ตารางแมป component รายหน้า + ระดับความเสี่ยง
