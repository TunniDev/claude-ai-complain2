<template>
    <v-dialog
        v-model="dialog"
        class="dialog-reset"
        persistent
        width="500"
    >
    <v-card>
        <v-card-title class="text-h5">
            เปลี่ยนรหัสผ่าน
        </v-card-title>
        <v-form
            ref="formReset"
            class="form-reset"
            v-model="valid"
            @submit.prevent="resetPassword"
        >
            <v-card-text>
                <p class="style-label">รหัสผ่านปัจจุบัน <span>*</span></p>
                <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    label="รหัสผ่านปัจจุบัน"
                    required
                    density="compact"
                    variant="outlined"
                    :type="showPassword ? 'text' : 'password'"
                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showPassword = !showPassword"
                    autocomplete="on"
                    :maxlength="20"
                ></v-text-field>
                <p class="style-label">รหัสผ่านใหม่ <span>*</span></p>
                <v-text-field
                    v-model="newPassword"
                    :rules="newPasswordRules"
                    label="รหัสผ่านใหม่"
                    required
                    density="compact"
                    variant="outlined"
                    :type="showPassword2 ? 'text' : 'password'"
                    :append-inner-icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showPassword2 = !showPassword2"
                    autocomplete="on"
                    :maxlength="20"
                ></v-text-field>
                <p class="style-label">ยืนยันรหัสผ่านใหม่ <span>*</span></p>
                <v-text-field
                    v-model="confirmPassword"
                    :rules="confirmPasswordRules"
                    label="ยืนยันรหัสผ่านใหม่"
                    required
                    density="compact"
                    variant="outlined"
                    hide-details
                    :type="showPassword3 ? 'text' : 'password'"
                    :append-inner-icon="showPassword3 ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showPassword3 = !showPassword3"
                    autocomplete="on"
                    :maxlength="20"
                ></v-text-field>
                <p v-if="errorMessage" class="error_message not-match">{{ errorMessage }}</p>
                <p class="valid-text mt-3">*หมายเหตุ กำหนดรหัสผ่าน 8 ตัวอักษรขึ้นไป ประกอบด้วย อักษรภาษาอังกฤษ พิมพ์ใหญ่ พิมพ์เล็ก อักขระพิเศษ เเละตัวเลข</p>
                <v-card-actions class="px-0">
                    <v-spacer></v-spacer>
                    <v-btn class="btn-submit" color="white" variant="text" type="submit">บันทึก</v-btn>
                    <v-btn class="btn-cancel" variant="text" @click="close">ยกเลิก </v-btn>
                </v-card-actions>
            </v-card-text>
        </v-form>
      </v-card>
    </v-dialog>
  </template>
  <script>
    import axios from "axios";
    import Swal from 'sweetalert2';
    import store from '../store/index.js';
    export default {
        props: ['userId'],
        data: () => ({
            check_roles: store.getters.user,
            valid:false,
            dialog: false,
            password: '',
            newPassword: '',
            confirmPassword: '',
            showPassword: false,
            showPassword2: false,
            showPassword3: false,
            errorMessage:'',
            passwordRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
                v => (v && v.length >= 8) || 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
            ],
            newPasswordRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
                v => (v && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v)) || 'กรุณาตั้งค่ารหัสผ่านตาม *หมายเหตุ',
            ],
            confirmPasswordRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
                v => (v && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v)) || 'กรุณาตั้งค่ารหัสผ่านตาม *หมายเหตุ',
            ],
        }),
        computed: {
            isPasswordMatch() {
                return this.newPassword === this.confirmPassword;
            }
        },
        methods:{
            open() {
                this.dialog = true
            },
            close(){
                this.dialog = false
                this.$refs.formReset.reset()
                this.$refs.formReset.resetValidation()
            },
            async resetPassword(){
                try {
                    console.log(this.check_roles)
                    const { valid } = await this.$refs.formReset.validate()
                    if (valid) {
                        if (this.isPasswordMatch) {
                            let fd = {
                                "id"            : this.userId,
                                "newPassword"   : this.newPassword,
                                "password"      : this.password,
                            }
                            let path = `/api/user/reset-password`
                            let response = await axios.post(`${path}`, fd)

                            await Swal.fire({
                                icon: 'success',
                                title: 'บันทึกสำเร็จ',
                                text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
                            })
                            this.dialog = false
                            this.$refs.formReset.reset()
                            console.log(response);
                        } else {
                            this.errorMessage = 'รหัสผ่านไม่ตรงกัน'
                        }
                    }
                } catch (error) {
                    Swal.fire({
                    icon: 'error',
                    title: 'บันทึกไม่สำเร็จ',
                    text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
                    })
                    console.log('error_resetPassword', error );
                }
            },
        }
    }
</script>
<style scoped>
.dialog-reset{
    background-color: #1e1e1ecc!important;
}
:deep(.v-icon){
    font-size: 24px;
}
.btn-cancel{
    border: 1px solid #003366;
    color: #003366;
}
.btn-submit{
    border: 1px solid #003366;
    background: #003366;
}
.valid-text{
        color: red;
    }
</style>
