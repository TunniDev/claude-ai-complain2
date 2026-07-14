<template>
    <div>
        <p class="style-label">รหัสผ่านใหม่ <span>*</span></p>
        <v-text-field
            v-model="newPassword"
            :rules="newPasswordRules"
            label="รหัสผ่านใหม่"
            required
            density="compact"
            variant="outlined"
            :type="showNewPassword ? 'text' : 'password'"
            :append-inner-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showNewPassword = !showNewPassword"
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
            :type="showConfirmPassword ? 'text' : 'password'"
            :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showConfirmPassword = !showConfirmPassword"
            autocomplete="on"
            :maxlength="20"
        ></v-text-field>
    </div>
</template>

<script>
export default {
    data: () => ({
        newPassword: '',
        confirmPassword: '',
        showNewPassword: false,
        showConfirmPassword: false,
        newPasswordRules: [
            v => !!v || 'กรุณากรอกข้อมูล',
            v => (v && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v)) || 'กรุณาตั้งค่ารหัสผ่านตาม *หมายเหตุ ',
          ],
          confirmPasswordRules: [
            v => !!v || 'กรุณากรอกข้อมูล',
            v => (v && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v)) || 'กรุณาตั้งค่ารหัสผ่านตาม *หมายเหตุ',
          ],
    }),

}
</script>

<style>
    .valid-text{
        color: red;
    }
    .not-match{
        background: #e7e7e7;
        text-align: center;
    }
</style>
