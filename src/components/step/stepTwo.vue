<template>
    <v-card class="form-register">
        <v-row>
            <v-col cols="12" sm="6">
                <div class="h2">ข้อมูลผู้ร้อง / ข้อมูลติดต่อ</div>
            </v-col>
            <v-col v-if="!check_page" class="text-right">
                <router-link to="/user/login">เคยร้องเรียนผ่านเว็บไซต์แล้ว ? / เข้าสู่ระบบ</router-link>
            </v-col>
        </v-row>

        <v-row justify="space-between" class="align-center">
            <v-col>
                <p class="style-label"><span>*</span>Email :</p>
                <v-text-field
                    v-if="!check_page"
                    v-model="item.email"
                    :rules="emailRules"
                    label="ระบุอีเมล"
                    required
                    density="compact"
                    variant="outlined"
                    :maxlength="50"
                    @input="checkRulesLength"
                ></v-text-field>
                <v-text-field
                    v-else
                    v-model="item.email"
                    required
                    density="compact"
                    variant="outlined"
                    :disabled="disabled == true"
                    :maxlength="50"
                    @input="checkRulesLength"
                ></v-text-field>
            </v-col>
             <v-col md="3" v-if="!check_page">
                <v-btn
                    variant="flat"
                    color="primary"
                    @click="checkMail"
                    >
                    ตรวจสอบอีเมล
                </v-btn>
             </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="style-label"><span>*</span>ชื่อ :</p>
                <v-text-field
                    v-model="item.name"
                    :rules="nameRules"
                    label="กรอกชื่อ"
                    required
                    density="compact"
                    variant="outlined"
                    :maxlength="maxLengthFifty"
                    @input="checkRulesLength(item.name.length, maxLengthFifty)"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="5">
                <p class="style-label"><span>*</span>นามสกุล :</p>
                <v-text-field
                    v-model="item.lastname"
                    :rules="lastnameRules"
                    label="นามสกุล"
                    required
                    density="compact"
                    variant="outlined"
                    :maxlength="50"
                    @input="checkRulesLength(item.lastname.length, maxLengthFifty)"
                ></v-text-field>
            </v-col>

            <v-col cols="12" md="2">
                <p class="style-label"><span>*</span>อายุ (ปี) : </p>
                <v-text-field
                    v-model="item.age"
                    :rules="ageRules"
                    label="อายุ"
                    required
                    density="compact"
                    variant="outlined"
                    :maxlength="2"
                ></v-text-field>
            </v-col>
        </v-row>

         <v-row>
            <v-col cols="12" md="6">
                <p class="style-label"><span>*</span>เบอร์โทรศัพท์มือถือ : </p>
                <v-text-field
                    v-model="item.phone"
                    :rules="phoneRules"
                    label="โทรศัพท์มือถือ"
                    :maxlength="10"
                    required
                    density="compact"
                    variant="outlined"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
                <p class="style-label">เบอร์ติดต่ออื่น ๆ :</p>
                <v-text-field
                    v-model="item.phone_other"
                    label="เบอร์ติดต่ออื่น ๆ"
                    :maxlength="10"
                    density="compact"
                    variant="outlined"
                ></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="12">
                <p class="style-label"><span>*</span>ที่อยู่ : </p>
                <v-textarea
                    v-model="item.address"
                    :rules="addressRules"
                    label="ที่อยู่"
                    rows="2"
                    density="compact"
                    variant="outlined"
                    :maxlength="maxLengthTwoHundred"
                    @input="checkRulesLength(item.address.length, maxLengthTwoHundred)"
                ></v-textarea>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="3">
                <p class="style-label">จังหวัด</p>
                <v-autocomplete
                    :items="selectProvince"
                    v-model="province"
                    item-title="value"
                    item-value="id"
                    label="เลือกจังหวัด"
                    variant="outlined"
                    density="compact"
                    return-object
                ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="3">
                <p class="style-label">เขต / อำเภอ</p>
                <v-select
                    :items="selectDistrict"
                    v-model="district"
                    item-title="value"
                    item-value="id"
                    label="เลือกเขต/อำเภอ"
                    variant="outlined"
                    density="compact"
                    return-object
                ></v-select>
            </v-col>
            <v-col cols="12" md="3">
                <p class="style-label">แขวง / ตำบล</p>
                <v-select
                    :items="selectSubDistrict"
                    v-model="subdistrict"
                    item-title="value"
                    item-value="id"
                    label="เลือกแขวง/ตำบล"
                    variant="outlined"
                    density="compact"
                    return-object
                ></v-select>
            </v-col>
            <v-col cols="12" md="3">
                <p class="style-label">รหัสไปรษณีย์</p>
                <v-text-field
                    v-model="item.postcode"
                    label="รหัสไปรษณีย์"
                    required
                    density="compact"
                    variant="outlined"
                    :maxlength="5"
                ></v-text-field>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    import  axios  from "axios"
    import Swal from 'sweetalert2'
    export default {
        props: ['datas', 'check_page'],
        data: () => ({
            disabled: true,
            maxLength: 10,
            item: {},
            email: '',
            name: '',
            lastname: '',
            age: '',
            phone: '',
            phone_other: '',
            address: '',
            postcode: '',
            province: null,
            district: null,
            subdistrict: null,
            selectProvince:[],
            selectDistrict: [],
            selectSubDistrict: [],
            maxLengthFifty: 50,
            maxLengthTwoHundred: 200,
            emailRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
                v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'อีเมลไม่ถูกต้อง',
                v => (v && v.length <= 50) || 'กรอกรายละเอียดห้ามเกิน 50 ตัวอักษร',
            ],
            nameRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
                v =>/^[a-zA-Zก-ฮะ-์\s]+$/.test(v) ||` ห้ามกรอกอักขระพิเศษ เเละตัวเลข`,
                v => (v && v.length <= 50) || 'กรอกรายละเอียดห้ามเกิน 50 ตัวอักษร',
            ],
            lastnameRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
                v =>/^[a-zA-Zก-ฮะ-์\s]+$/.test(v) ||` ห้ามกรอกอักขระพิเศษ เเละตัวเลข`,
                v => (v && v.length <= 50) || 'กรอกรายละเอียดห้ามเกิน 50 ตัวอักษร',
            ],
            addressRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
                v => (v && v.length <= 200) || 'กรอกรายละเอียดห้ามเกิน 200 ตัวอักษร',
            ],
            ageRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
                v => /^[0-9]*$/.test(v) ||` ห้ามกรอกอักขระพิเศษ เเละตัวอักษร`
            ],
            phoneRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
                v => /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(v) ||` ห้ามกรอกอักขระพิเศษ เเละตัวอักษร`
            ],
        }),

        mounted(){
            this.getProvince()
        },
        watch:{
            province : function(v_province){
                let province_id = null
                if(v_province && v_province.id){
                    province_id = v_province.id
                }else{
                    province_id = v_province
                }
                this.getDistricts(province_id);
            },
            district : function(v_district){
                let district_id = null
                if(v_district && v_district.id){
                    district_id = v_district.id
                }else{
                    district_id = v_district
                }
                this.getSubDistricts(district_id);
            },
            subdistrict: function(v_subdistrict){
                if(v_subdistrict && v_subdistrict.id){
                    this.item.postcode = v_subdistrict.postcode
                }
            },
            datas(){
                if(this.datas){
                    this.item = this.datas
                    if(this.datas.province_id){
                        this.province = this.datas.province_id
                    }
                    if(this.datas.district_id){
                        this.district = this.datas.district_id
                    }
                    if(this.datas.subdistrict_id){
                        this.subdistrict = this.datas.subdistrict_id
                        this.item.postcode  = this.datas.postcode
                    }
                }
            }
        },
        methods: {
            async checkMail(){
               if(this.item.email){
                try {
                    let path = `/api/user/checkMail`
                    let response = await axios.post(`${path}`, { "email": this.item.email})

                    if(response.data.status == 200){
                        await Swal.fire({
                            icon: 'info',
                            text: 'ยังไม่มีอีเมลนี้ในระบบ',
                        })
                    }
                } catch (error) {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'มีอีเมลนี่ในระบบเเล้ว',
                    })
                }
               }else{
                    await Swal.fire({
                        icon: 'info',
                        title: 'กรุณากรอกอีเมล',
                    })
               }
            },
            async getProvince(){
                let path = `/api/get/province`
                let response = await axios.get(`${path}`)

                this.selectDistrict = [];
                this.selectSubDistrict = [];

                response.data.data.forEach(item => {
                    this.selectProvince.push({'id':item.province_id, 'value':item.name_th})
                })
            },
            async getDistricts(province_id){
                let path = `/api/get/districts`
                let response = await axios.get(`${path}/`+province_id)

                if(this.selectDistrict.length !== 0){
                    this.selectDistrict = []
                    this.selectSubDistrict = []
                    this.item.postcode = ''
                }

                response.data.data.forEach(item => {
                    this.selectDistrict.push({'id':item.district_id, 'value':item.name_th})
                })
            },
            async getSubDistricts(district_id){
                let path = `/api/get/subdistricts`
                let response = await axios.get(`${path}/`+district_id)

                if(this.selectSubDistrict.length !== 0){
                    this.selectSubDistrict = []
                    this.item.postcode = ''
                }

                response.data.data.forEach(item => {
                    this.selectSubDistrict.push({'id':item.subdistrict_id, 'value':item.name_th, 'postcode': item.postcode})
                })
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
     .box-gender{
        display: flex;
        justify-content: center;
        height: 40px;
        align-items: center;
    }
    .box-gender .male{
        width: 50%;
        background: #010128;
        padding: 8px;
        border: 1px solid #010128;
        color: white;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }
    .box-gender .female{
        width: 50%;
        background: white;
        padding: 8px;
        border: 1px solid #010128;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }
</style>
