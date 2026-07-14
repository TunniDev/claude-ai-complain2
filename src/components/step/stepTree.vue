<template>
    <v-card class="form-register">
        <div class="box-officer">
            <v-row>
                <v-col>
                    <div class="h2">ร้องเรียน เจ้าหน้าที่ / หน่วยงาน </div>
                </v-col>
            </v-row>
           <v-row>
            <v-col><v-checkbox label="ไม่ระบุชื่อ - นามสกุล" v-model="notSpecName" v-if="isCgd"></v-checkbox></v-col>
           </v-row>
            <v-row>
                <v-col cols="12" sm="6">
                <p class="style-label"><span>*</span>ชื่อ : </p>
                <v-text-field
                    ref="nameField"
                    v-model="name"
                    :rules="nameRules"
                    label="กรอกชื่อ"
                    :required="!notSpecName"
                    :disabled="notSpecName && isCgd"
                    density="compact"
                    variant="outlined"
                    :maxlength="maxLengthFifty"
                    @input="checkRulesLength(name.length, maxLengthFifty)"
                ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                <p class="style-label"><span>*</span>นามสกุล : </p>
                    <v-text-field
                        ref="lastnameField"
                        v-model="lastname"
                        :rules="lastnameRules"
                        label="นามสกุล"
                        :required="!notSpecName"
                        :disabled="notSpecName && isCgd"
                        density="compact"
                        variant="outlined"
                        :maxlength="maxLengthFifty"
                        @input="checkRulesLength(lastname.length, maxLengthFifty)"
                    ></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="6">
                    <p class="style-label"><span>*</span>หน่วยงาน : </p>
                    <v-text-field
                        v-model="division"
                        :rules="divisionRules"
                        label="หน่วยงาน"
                        required
                        density="compact"
                        variant="outlined"
                        :maxlength="maxLengthTwoHundred"
                        @input="checkRulesLength(division.length, maxLengthTwoHundred)"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                    <p class="style-label">รูปพรรณสันฐาน :</p>
                    <v-text-field
                        v-model="description_face"
                        label="รูปพรรณสันฐาน"
                        required
                        density="compact"
                        variant="outlined"
                        :maxlength="maxLengthTwoHundred"
                        @input="checkRulesLength(description_face.length, maxLengthTwoHundred)"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-divider></v-divider>
        </div>

        <div class="box-complaint">
            <v-row>
                <v-col cols="12" sm="6">
                    <div class="h2 mt-5">เรื่องร้องเรียน</div>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="6">
                    <p class="style-label"><span>*</span>หัวเรื่อง : </p>
                    <v-text-field
                        v-model="complain_topic"
                        :rules="topicRules"
                        label="เรื่องร้องเรียน"
                        required
                        density="compact"
                        variant="outlined"
                        :maxlength="maxLengthTwoHundred"
                        @input="checkRulesLength(complain_topic.length, maxLengthTwoHundred)"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                    <p class="style-label"><span>*</span>สถานที่เกิดเหตุ : </p>
                    <v-text-field
                        v-model="complain_location"
                        :rules="locationRules"
                        label="สถานที่เกิดเหตุ"
                        required
                        density="compact"
                        variant="outlined"
                        :maxlength="maxLengthTwoHundred"
                        @input="checkRulesLength(complain_location.length, maxLengthTwoHundred)"
                    ></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="6">
                    <p class="style-label mb-3"><span>*</span>ช่วงวัน - เวลาเกิดเหตุ : ตั้งแต่ </p>
                    <DateField v-model="start_date" label="ตั้งเเต่วันที่" />
                    <TimeField v-model="complain_start_time" label="ตั้งเเต่เวลา" />
                </v-col>

                <v-col cols="12" sm="6">
                    <p class="style-label mb-3"><span>*</span>ถึง : </p>
                    <DateField v-model="end_date" :min="start_date" label="ตั้งเเต่วันที่" />
                    <TimeField v-model="complain_end_time" :min="complain_start_time" label="ถึงเวลา" />
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <p class="style-label"><span>*</span>รายละเอียดเรื่องร้องเรียน : </p>
                    <v-textarea
                        variant="outlined"
                        v-model="complain_detail"
                        :rules="complainDetailRules"
                        label="รายละเอียดเรื่องร้องเรียน"
                        clearable
                        :maxlength="maxLengthFiveHundredTwelve"
                        @input="checkRulesLength(complain_detail.length, maxLengthFiveHundredTwelve)"
                    ></v-textarea>
                </v-col>
            </v-row>
        </div>

        <div class="box-upload">
            <v-row>
                <v-col>
                    <div class="h2">เอกสารประกอบการร้องเรียน</div>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <p class="style-label"><span>*</span>upload file : (เเนบไฟล์ png, jpeg, gif, pdf) </p>
                    <v-file-input v-model="files"
                        :accept="acceptTypes"
                        :rules="fileRules"
                        variant="outlined"
                        density="compact"
                        multiple
                        chips
                        clearable
                        label="เลือกไฟล์">
                    </v-file-input>
                </v-col>
            </v-row>
        </div>
    </v-card>
</template>

<script>
import Swal from 'sweetalert2'
import DateField from '@/components/DateField.vue'
import TimeField from '@/components/TimeField.vue'
export default {
    components: { DateField, TimeField },
    data: () => ({
        notSpecName: false,
        data:{},
        name: '',
        lastname: '',
        division: '',
        description_face: '',
        complain_topic: '',
        complain_location: '',
        complain_start_time: null,
        complain_end_time: null,
        complain_detail: '',
        selectDivision: [],
        currFiles: [],
        previousFiles: [],
        files: [],
        modal: false,
        modal2: false,
        acceptTypes: "image/*, application/pdf",
        maxLengthFifty: 50,
        maxLengthTwoHundred: 200,
        maxLengthFiveHundredTwelve: 512,
        nameRules: [
            v => !!v || 'กรุณากรอกข้อมูล / หากไม่ทราบให้ระบุคำว่า เจ้าหน้าที่',
            v =>/^[a-zA-Zก-ฮะ-์\s]+$/.test(v) ||` ห้ามกรอกอักขระพิเศษ เเละตัวเลข`,
        ],
        lastnameRules: [
            v => !!v || 'กรุณากรอกข้อมูล / หากไม่ทราบให้ระบุคำว่า เจ้าหน้าที่',
            v =>/^[a-zA-Zก-ฮะ-์\s]+$/.test(v) ||` ห้ามกรอกอักขระพิเศษ เเละตัวเลข`,
            v => (v && v.length <= 50) || 'กรอกรายละเอียดห้ามเกิน 50 ตัวอักษร',
        ],
        divisionRules: [
            v => !!v || 'กรุณากรอกข้อมูลหน่วยงานที่ติดต่อ / ต้องการร้องเรียน',
            v => (v && v.length <= 200) || 'กรอกรายละเอียดห้ามเกิน 200 ตัวอักษร',
        ],
        topicRules: [
            v => !!v || 'กรุณากรอกข้อมูล',
            v => (v && v.length <= 200) || 'กรอกรายละเอียดห้ามเกิน 200 ตัวอักษร',
        ],
        complainDetailRules: [
            v => !!v || 'กรุณากรอกข้อมูล',
            v => (v && v.length <= 512) || 'กรอกรายละเอียดห้ามเกิน 512 ตัวอักษร',
        ],
        locationRules: [
            v => !!v || 'กรุณากรอกข้อมูล',
        ],
        fileRules: [
            value => {
            if (!value || value.length === 0) {
                return "กรุณาเลือกไฟล์";
            }
            if (value.length > 5) {
                return "อัพโหลดไฟล์ได้ไม่เกิน 5 ไฟล์";
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
        start_date: new Date().toISOString().substr(0, 10),
        end_date: new Date().toISOString().substr(0, 10),
      }),
    mounted(){
        if (this.$route.path.includes("cgd")){
        }
    },
    computed: {
        isCgd(){
            return this.$route.path.includes("cgd") ? true : false
        },
    },
    watch: {
        start_date(v){
            this.end_date = v
        },
        complain_start_time(){
            this.complain_end_time = null
        },
        files(val) {
            this.previousFiles = val
        },
        notSpecName(val){
            if (val){
                this.$refs.nameField.resetValidation()
                this.name = 'ไม่ระบุชื่อ'
                this.$refs.lastnameField.resetValidation()
                this.lastname = 'ไม่ระบุนามสกุล'
            }else{
                this.$refs.nameField.resetValidation()
                this.name = ''
                this.$refs.lastnameField.resetValidation()
                this.lastname = ''
            }
        },
    },

    methods:{
        remove (index) {
            this.files.splice(index, 1)
        },
        checkRulesLength(valueLength, maxLength){
            if(valueLength === maxLength){
                Swal.fire(`กรอกได้ไม่เกิน ${maxLength} ตัวอักษร`)
            }
        }
    }
}
</script>

<style>
</style>
