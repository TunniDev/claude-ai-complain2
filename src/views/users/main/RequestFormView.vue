<template>
    <div class="page-main">
        <div class="head-topic">
            <v-container>
                <v-row>
                    <span class="head-left">แบบฟอร์มลงทะเบียนเรื่องร้องเรียน</span>
                </v-row>
            </v-container>
        </div>
        <div class="section-main">
            <v-container class="mt-3">
                <span class="h1">ขั้นตอนการร้องเรียนเรื่องทุจริต</span>
                    <v-stepper v-model="e1" class="step">
                        <v-stepper-header class="stepper-header mt-3">
                            <v-stepper-item :complete="e1 > 1" :value="1" title="ข้อตกลงเเละเงื่อนไขการร้องเรียน"></v-stepper-item>
                            <v-divider></v-divider>
                            <v-stepper-item :complete="e1 > 2" :value="2" title="เลือกช่องทางร้องเรียน"></v-stepper-item>
                            <v-divider></v-divider>
                            <v-stepper-item :complete="e1 > 3" :value="3" title="ข้อมูลผู้ร้องเรียน"></v-stepper-item>
                            <v-divider></v-divider>
                            <v-stepper-item :complete="e1 > 4" :value="4" title="ข้อมูลการร้องเรียน"></v-stepper-item>
                        </v-stepper-header>
                        <v-stepper-window>
                            <v-stepper-window-item :value="1">
                                <stepOne/>
                                <div class="text-center">
                                    <v-btn color="#003366" class="text-white" @click="checkStepOne">  ข้าพเจ้ายอมรับข้อตกลงและเงื่อนไข</v-btn>
                                </div>
                            </v-stepper-window-item>

                            <v-stepper-window-item :value="2">
                            <div>
                                <stepOneplus />
                            <v-container class="complaint-channel-wrap">
                              <v-row justify="center" align="center" class="complaint-channel-grid">
                                <v-col cols="12" class="d-flex justify-center">
                                  <v-img
                                    :src="imgBanner11"
                                    alt="สำหรับเจ้าหน้าที่"
                                    class="channel-image officer-channel image-link"
                                    contain
                                    role="link"
                                    aria-label="เข้าสู่ระบบสำหรับเจ้าหน้าที่"
                                    @click="openOfficerLogin"
                                  />
                                </v-col>

                                <v-col cols="12" class="d-flex justify-center">
                                  <v-img
                                    :src="imgBanner12"
                                    alt="สำหรับผู้ร้องเรียน"
                                    class="channel-image citizen-channel image-link"
                                    contain
                                    @click="checkStepOneplus"
                                  />
                                </v-col>
                              </v-row>
                            </v-container>
                            </div>
                            </v-stepper-window-item>

                            <v-stepper-window-item :value="3">
                                <v-form
                                    ref="formRegister"
                                    v-model="validOne"
                                >
                                    <StepTwo ref="user"/>
                                    <div class="text-right">
                                        <v-btn color="#003366" class="btn-next text-white"  @click="checkStepTwo">บันทึก</v-btn>
                                    </div>
                                </v-form>
                            </v-stepper-window-item>

                            <v-stepper-window-item :value="4">
                                <v-alert type="success">
                                คุณ : {{ name }} ลงทะเบียนสำเร็จ
                                </v-alert>
                                <v-form
                                    ref="formOfficer"
                                    v-model="validOne"
                                >
                                    <StepTree ref="employee"/>
                                    <div class="text-right">
                                        <v-btn color="#003366" class="btn-next text-white" @click="checkStepTree">บันทึก</v-btn>
                                    </div>
                                </v-form>
                            </v-stepper-window-item>
                        </v-stepper-window>
                    </v-stepper>
            </v-container>
        </div>
    </div>
</template>

<script>
import axios  from 'axios'
import moment from 'moment'
import Swal from 'sweetalert2'
import stepOne from '@/components/step/stepOne.vue'
import stepOneplus from '@/components/step/stepOneplus.vue'
import StepTwo from '@/components/step/stepTwo.vue'
import StepTree from '@/components/step/stepTree.vue'
import imgBanner11 from '@/assets/images/Blue Waves Surfing Club Logo (11)_0.png'
import imgBanner12 from '@/assets/images/Blue Waves Surfing Club Logo (12)_0.png'
  export default {
  components: { stepOne, stepOneplus, StepTwo, StepTree },
    data: () => ({
        e1: 1,
        email: '',
        name: '',
        user: {},
        employee: {},
        isOkay: false,
        step_one : false,
        step_oneplus: false,
        validOne: true,
        validTwo: true,
        blobUrl: null,
        register_id : null,
        dataString: "Hello, world!",
        imgBanner11,
        imgBanner12,
    }),
    methods: {
        checkStepOne(){
            this.e1 = 2
            this.step_one = true
        },
       checkStepOneplus(){
            this.e1 = 3
            this.step_oneplus = true
        },
        openOfficerLogin(){
            window.open('https://irac.cgd.go.th/cgd/login', '_blank', 'noopener')
        },

        async checkStepTwo(){
            const { valid } = await this.$refs.formRegister.validate()
            if (valid) {
                try {
                    this.user = this.$refs.user
                    this.email = this.user.item.email
                    this.name = this.user.item.name + ' ' + this.user.item.lastname

                    let path = `/api/user/checkMail`
                    let response_mail = await axios.post(`${path}`, { "email": this.user.item.email})
                    console.log(response_mail);

                    if(response_mail.data.status == 200){
                        let address = this.user.item.address !== undefined ? this.user.item.address : ''
                        let province_th = this.user.province !== null ? ' จังหวัด' + this.user.province.value || this.user.province : ''
                        let district_th = this.user.district !== null ?  ' เเขวง' + this.user.district.value || this.user.district : ''
                        let subdistrict_th = this.user.subdistrict !== null ? ' เขต' + this.user.subdistrict.value  || this.user.subdistrict : ''
                        let postcode = this.user.item.postcode !== undefined ? this.user.item.postcode : ''
                        let all_address = address + province_th + district_th  + subdistrict_th + ' ' +postcode

                        let fd = {
                            "email"                 : this.user.item.email,
                            "name"                  : this.user.item.name,
                            "lastname"              : this.user.item.lastname,
                            "gender"                : this.user.item.gender,
                            "age"                   : this.user.item.age,
                            "phone"                 : this.user.item.phone,
                            "phone_other"           : this.user.item.phone_other,
                            "address"               : all_address,
                            "province"              : this.user.province !== null ? this.user.province.id || this.user.province : null,
                            "province_name"         : this.user.province !== null ? this.user.province.value || this.user.province : null,
                            "district"              : this.user.district !== null ? this.user.district.id || this.user.district : null,
                            "district_name"         : this.user.district !== null ? this.user.district.value || this.user.district : null,
                            "subdistrict"           : this.user.subdistrict !== null ? this.user.subdistrict.id  || this.user.subdistrict : null,
                            "subdistrict_name"      : this.user.district !== null ? this.user.subdistrict.value || this.user.subdistrict : null,
                            "postcode"              : this.user.item.postcode,
                            "check_policy"          : this.step_one,
                        }

                        await Swal.fire({
                            icon: 'info',
                            title: 'คุณต้องการยืนยันข้อมูลใช่หรือไม่ ?',
                            html:
                                '<span>Email : </span> <b>' + this.user.item.email + '</b><br>' +
                                '<span>ชื่อ : </span> <b>' + this.user.item.name  + '</b><br>' +
                                '<span>นามสกุล : </span> <b>' + this.user.item.lastname +'</b>',
                            showDenyButton: false,
                            showCancelButton: true,
                            confirmButtonText: 'ยืนยัน',
                            cancelButtonText: `ยกเลิก`,
                        }).then(async (result)  => {
                            if (result.isConfirmed) {
                                let path_regis = `/api/user/register`
                                let response = await axios.post(`${path_regis}`, fd)
                                this.register_id = response.data.register_id
                                await Swal.fire('บันทึกข้อมูลเรีบร้อยเเล้ว', '', 'success')
                                this.e1 = 4
                            } else if (result.isDenied) {
                                Swal.fire('Changes are not saved', '', 'info')
                            }
                        })
                    }
                } catch (error) {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'มีอีเมลนี่ในระบบเเล้ว',
                    })
                }
            }
        },

        async checkStepTree(){
            const { valid } = await this.$refs.formOfficer.validate()
            if (valid) {
                this.employee = this.$refs.employee
                try {
                    let end_date =  `${moment(this.employee.end_date).format('YYYY-MM-DD')}`
                    let end_time = this.employee.complain_end_time !== null ? `${this.employee.complain_end_time}` : ''
                    let start_time = this.employee.complain_start_time !== null ? `${this.employee.complain_start_time}` : ''

                    console.log(this.employee.end_date);
                    let fd = {
                        "name"              : this.employee.name,
                        "lastname"          : this.employee.lastname,
                        "register_id"       : this.register_id,
                        "division"          : this.employee.division,
                        "description_face"  : this.employee.description_face,
                        "topic"             : this.employee.complain_topic,
                        "location"          : this.employee.complain_location,
                        "start_date"        : `${moment(this.employee.start_date).format('YYYY-MM-DD') + ' ' + start_time}`,
                        "end_date"          : `${end_date + ' ' + end_time}`,
                        "detail"            : this.employee.complain_detail,
                        "create_by"         : this.register_id,
                        "modified_by"       : this.register_id,
                    }
                    await Swal.fire({
                        icon: 'info',
                        title: 'คุณต้องการยืนยันข้อมูลใช่หรือไม่ ?',
                        showDenyButton: false,
                        showCancelButton: true,
                        confirmButtonText: 'ยืนยัน',
                        cancelButtonText: `ยกเลิก`,
                    }).then(async (result)  => {
                        if (result.isConfirmed) {
                            let path = `/api/user/complain`
                            let response = await axios.post(`${path}`, fd)

                            if(response){
                                const formData = new FormData();
                                formData.append('id', response.data.complain_id);
                                formData.append('types', 'Complain');

                                for (let i = 0; i < this.employee.files.length; i++) {
                                    formData.append('files', this.employee.files[i]);
                                    const complain_id = response.data.complain_id
                                    let number = i + 1
                                    const file = this.employee.files[i]
                                    const arr_file = file.type.split("/")
                                    let file_name = ''

                                    if(file.type.startsWith('image/')){
                                        file_name = 'imgComplain' + complain_id + '_' + number + '.' + arr_file[1]
                                    }else if(file.type === 'application/pdf'){
                                        file_name = 'pdfComplain' + complain_id + '_' + number + '.' + arr_file[1]
                                    }

                                    let fd_upload = {
                                        "register_id"   : this.register_id,
                                        "complain_id"   : complain_id,
                                        "file_original" : file.name,
                                        "file_name"     : file_name,
                                        "file_type"     : file.type
                                    }
                                    let path = `/api/user/files`
                                    await axios.post(`${path}`, fd_upload )
                                }
                                await this.myUpload(formData)
                            }
                            await Swal.fire('รับเรื่องร้องเรียนเรียบร้อยเเล้ว', '', 'success')
                            await  this.$router.push("/user/login");
                        }
                    })
                } catch (error) {
                    console.log("insertcomplain", error );
                }
            }
        },
        dataUrl(v){
            const blobUrl = window.URL.createObjectURL(v);
            window.open(blobUrl, '_blank');
        },
        async myUpload(files){
            try {
                await axios.post('/api/uploadsFile', files)
                    .then(response => {
                        console.log(response.data);
                    })
                    .catch(error => {
                        console.error(error);
                });
            } catch (error) {
                console.log(error);
            }
        },
        login() {
            this.$router.push({name:'userLogin'})
        },
    },
  }
</script>
<style>
    .head-topic{
        background: #003366;
    }
    .head-left{
        color: white;
        font-size: 24px;
        padding: 1rem 0;
    }
    .h1{
        font-size: 30px;
    }
    .step{
        box-shadow: none!important;
    }
    .stepper-header{
        box-shadow: none;
    }
    .form-register{
        box-shadow: none!important;
    }
    .text-white span{
        color: white;
    }
    .btn-next{
        width: 100px;
    }
    .btn-back{
        width: 100px;
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
        border: 1px solid #003366;
        background: white;
        color: #003366;
    }
    .v-icon{
        font-size: 14px!important;
    }
    .swal2-container {
        font-family: 'Prompt', sans-serif!important;
    }
    .swal2-title{
        font-size: 24px;
    }
    .swal2-confirm{
        border: 1px solid #003366!important;
        background-color: #003366!important;
        color: white!important;
    }
    .swal2-cancel{
        color: #003366!important;
        border: 1px solid #003366!important;
        background-color: white!important;
    }
    .v-messages__message {
        line-height: 20px!important;
    }
    /* ช่องทางร้องเรียน (จากการปรับปรุง template) */
    .complaint-channel-wrap{
        margin-top: 1rem;
    }
    .complaint-channel-grid{
        gap: 1rem;
    }
    .channel-image{
        max-width: 460px;
        width: 100%;
    }
    .image-link{
        cursor: pointer;
    }
</style>
