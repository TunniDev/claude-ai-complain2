<template>
   <v-file-input v-model="files"
        :show-size="1000"
        :accept="acceptTypes"
        :rules="fileRules"
        variant="outlined"
        density="compact"
        multiple
        chips
        clearable
        hide-details="auto"
        label="ไฟล์เเนบ">
    </v-file-input>
</template>

<script>
export default {
    data: () => ({
        currFiles: [],
        previousFiles: [],
        files: [],
        acceptTypes: "image/*, application/pdf",
        fileRules: [
            value => {
            if (!value || value.length === 0) {
                return "กรุณาอัพโหลดไฟล์";
            }
            if (value.length > 10) {
                return "อัพโหลดไฟล์ได้ไม่เกิน 10 ไฟล์";
            }
            const maxFileSize = 10 * 1024 * 1024;
            for (let i = 0; i < value.length; i++) {
                if (value[i].size > maxFileSize) {
                    return 'อัพโหลดไฟล์ขนาดไม่เกิน 10 mb';
                }
            }
            const allowedTypes = ["image/png", "image/jpeg", "image/gif", "application/pdf"];
            for (let i = 0; i < value.length; i++) {
                const file = value[i];
                if (!allowedTypes.includes(file.type)) {
                return "ประเภทไฟล์ที่อัพโหลดไม่ถูกต้อง";
                }
            }
            return true;
            }
        ],
    }),

    methods:{
        remove (index) {
            this.files.splice(index, 1)
        },
        clearFiles(){
            this.files = []
        }
    }
}
</script>

<style>
</style>
