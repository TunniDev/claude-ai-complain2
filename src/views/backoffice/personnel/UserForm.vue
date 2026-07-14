<template>
    <div class="user-form">
        <loaderView ref="loader" v-if="$route.name == 'personnel_formedit'"/>
        <BreadcrumbsView :items="item"/>
        <div class="style-page">
            <v-card class="style-card">
                <v-toolbar flat>
                    <v-toolbar-title class="h2">{{ formTitle }}</v-toolbar-title>
                </v-toolbar>
                <v-form
                    ref="form"
                    v-model="valid"
                >
                    <v-card-text>
                        <v-row align="center">
                            <v-col cols="12">
                                <p class="style-label"><span>*</span>รหัสผู้ใช้งาน : </p>
                                <v-text-field
                                    v-model="username"
                                    :rules="usernameRules"
                                    label="รหัสผู้ใช้งาน"
                                    density="compact"
                                    variant="outlined"
                                    hide-details="auto"
                                    clearable
                                    :maxlength="maxLengthFifty"
                                    @input="checkRulesLength(username.length, maxLengthFifty)"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row align="center">
                            <v-col cols="12" md="6">
                                <p class="style-label"><span>*</span>ชื่อ : </p>
                                <v-text-field
                                    v-model="name"
                                    :rules="nameRules"
                                    label="ชื่อ"
                                    density="compact"
                                    variant="outlined"
                                    hide-details="auto"
                                    clearable
                                    :maxlength="maxLengthFifty"
                                    @input="checkRulesLength(name.length, maxLengthFifty)"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <p class="style-label"><span>*</span>นามสกุล : </p>
                                <v-text-field
                                    v-model="lastname"
                                    :rules="lastnameRules"
                                    label="นามสกุล"
                                    density="compact"
                                    variant="outlined"
                                    hide-details="auto"
                                    clearable
                                    :maxlength="maxLengthFifty"
                                    @input="checkRulesLength(lastname.length, maxLengthFifty)"
                                ></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row align="center">
                            <v-col cols="12" md="6">
                                <p class="style-label"><span>*</span>ตำเเหน่ง : </p>
                                <v-text-field
                                    v-model="position"
                                    :rules="positionRules"
                                    label="ตำเเหน่ง"
                                    density="compact"
                                    variant="outlined"
                                    hide-details="auto"
                                    clearable
                                    :maxlength="maxLengthTwoHundred"
                                    @input="checkRulesLength(position.length, maxLengthTwoHundred)"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <p class="style-label"><span>*</span>หน่วยงาน : </p>
                                <v-select
                                    v-model="divisions"
                                    :items="selectDivisions"
                                    :rules="rules.divisionsRules"
                                    item-title="value"
                                    item-value="id"
                                    label="หน่วยงาน"
                                    density="compact"
                                    variant="outlined"
                                    hide-details="auto"
                                    clearable
                                ></v-select>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="6">
                                <p class="style-label"><span>*</span>ประเภทสิทธิ์การใช้งาน : </p>
                                <v-select
                                v-model="roles"
                                :items="selectRoles"
                                :rules="rules.rolesRules"
                                item-title="value"
                                item-value="id"
                                label="ประเภทสิทธิ์การใช้งาน"
                                density="compact"
                                variant="outlined"
                                hide-details="auto"
                                clearable
                                ></v-select>
                            </v-col>

                            <v-col cols="12" md="6">
                                <p class="style-label">สถานะการใช้งาน : </p>
                                <v-select
                                v-model="status"
                                :items="selectStatus"
                                item-title="value"
                                item-value="id"
                                label="สถานะการใช้งาน"
                                density="compact"
                                variant="outlined"
                                hide-details="auto"
                                clearable
                                ></v-select>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-toolbar flat class="box-button">
                        <v-btn class="btn btn-submit mr-2" variant="text" @click="saveUser">บันทึก</v-btn>
                        <v-btn class="btn btn-cancel mr-2" variant="text" @click="cancel">ยกเลิก</v-btn>
                        <v-btn
                          v-if="$route.name == 'personnel_formedit'"
                          class="btn btn-delete"
                          variant="flat"
                          color="error"
                          @click="deleteUser"
                        >
                          <i class="fa-solid fa-trash mr-1"></i> ลบผู้ใช้งาน
                        </v-btn>
                    </v-toolbar>
                </v-form>
            </v-card>
        </div>
    </div>
</template>
<script>
    import axios from "axios";
    import Swal from 'sweetalert2';
    import store from '../../../store/index.js';
    import loaderView from '@/components/loaderView.vue';
    import BreadcrumbsView from '@/components/breadcrumbsView.vue';
    export default {
  components: { loaderView, BreadcrumbsView },
        data: () => ({
            show1: false,
            valid: true,
            check_title :  true,
            user_id: null,
            username: '',
            password: '',
            name: '',
            lastname: '',
            position: '',
            admin_id: store.getters.user.id,
            maxLengthFifty: 50,
            maxLengthTwoHundred: 200,
            roles: { value: '', id: null },
            selectRoles: [
                { value: 'เจ้าหน้าที่รับเรื่อง', id: 'general' },
                { value: 'ผู้ดูเเลระบบ', id: 'admin' },
            ],
            divisions: { value: '', id: null },
            selectDivisions: [
                { value: 'ศทส.', id: 1 },
                { value: 'กบค.', id: 2 },
            ],
            status: { value: 'ใช้งาน', id: 1 },
            state: '',
            selectStatus: [
                { value: 'ใช้งาน', id: 1 },
                { value: 'ไม่ใช้งาน', id: 0 },
            ],
            usernameRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
                v => (v && v.length <= 50) || 'กรอกรายละเอียดห้ามเกิน 50 ตัวอักษร'
            ],
            passwordRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
                v => v.length >= 8 || 'Min 8 characters',
            ],
            nameRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
                v =>/^[a-zA-Zก-ฮะ-์\s]+$/.test(v) ||` ห้ามกรอกอักขระพิเศษ เเละตัวเลข`,
                v => (v && v.length <= 50) || 'กรอกรายละเอียดห้ามเกิน 50 ตัวอักษร'
            ],
            lastnameRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
                v =>/^[a-zA-Zก-ฮะ-์\s]+$/.test(v) ||` ห้ามกรอกอักขระพิเศษ เเละตัวเลข`,
                v => (v && v.length <= 50) || 'กรอกรายละเอียดห้ามเกิน 50 ตัวอักษร'
            ],
            positionRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
                v =>/^[a-zA-Zก-ฮะ-์\s]+$/.test(v) ||` ห้ามกรอกอักขระพิเศษ เเละตัวเลข`,
                v => (v && v.length <= 200) || 'กรอกรายละเอียดห้ามเกิน 200 ตัวอักษร'
            ],
            rules:{
                divisionsRules: [(v) =>  (v !== null && v !== '' && v !== undefined) || "เลือกประเภทหน่วยงาน"],
                rolesRules: [(v) =>  v.length> 0 || "เลือกประเภทสิทธิ์การใช้งาน"]
            },
            item: [
                { text: 'รายการบุคลากร', disabled: false, href: '/backoffice/personnel' },
                { text: 'ข้อมูลผู้ใช้งาน', disabled: true, href: 'breadcrumbs_link_1' },
            ],
        }),
        mounted(){
            if(this.$route.name == 'personnel_formedit'){
                this.getuserDetail()
            }
        },
        computed:{
            formTitle () {
                return this.$route.name == 'personnel_form' ? 'สร้างผู้ใช้งาน' : 'แก้ไขผู้ใช้งาน'
            },
        },
        methods: {
            checkRulesLength(valueLength, maxLength){
                if(valueLength === maxLength){
                    Swal.fire(`กรอกได้ไม่เกิน ${maxLength} ตัวอักษร`)
                }
            },
            async getuserDetail(){
                let path                    = `/api/backoffice/get/userDetail`
                let response                = await axios.get(`${path}/`+ this.$route.params.id)
                this.user_id                = response.data.data[0].id
                this.username               = response.data.data[0].username
                this.name                   = response.data.data[0].name
                this.lastname               = response.data.data[0].lastname
                this.position               = response.data.data[0].position
                this.divisions              = response.data.data[0].divisions
                this.roles                  = response.data.data[0].roles
                this.status                 = response.data.data[0].status
                this.state                  = response.data.data[0].state
                setTimeout(() => (this.$refs.loader.overlay = false), 300);
            },
            async saveUser(){
                const { valid } = await this.$refs.form.validate()
                if (valid) {
                    let fd = {
                        "admin_id"      : this.admin_id,
                        "user_id"       : this.user_id,
                        "username"      : this.username,
                        "password"      : this.password,
                        "name"          : this.name,
                        "lastname"      : this.lastname,
                        "position"      : this.position,
                        "divisions"     : this.divisions,
                        "roles"         : this.roles,
                        "status"        : this.$route.name == 'personnel_form'? this.status.id : this.status,
                        "state"         : this.state,
                    }
                    try {
                        let path = ''
                        if(this.$route.name == 'personnel_form'){
                            path = `/api/backoffice/create/user`
                        }else{
                            path = `/api/backoffice/edit/user`
                        }
                        let res = await axios.post(`${path}`, fd)
                        console.log(res);
                        Swal.fire({
                            icon: 'success',
                            title: 'บันทึกสำเร็จ',
                            text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
                        }).then( function(){
                            window.location.href = '/backoffice/personnel';
                        });
                    } catch (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'บันทึกไม่สำเร็จ',
                            text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
                        })
                        console.log('error :' + error)
                    }
                }
            },
            async deleteUser(){
                const result = await Swal.fire({
                    title: 'คำเตือน',
                    text: 'คุณต้องการลบผู้ใช้งานนี้ใช่หรือไม่ ?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'ลบ',
                    cancelButtonText: 'ยกเลิก',
                })
                if (!result.isConfirmed) return
                try {
                    let path = `/api/backoffice/update/deleteUser`
                    await axios.post(`${path}`, {
                        id: this.user_id,
                        admin_id: this.admin_id,
                        check_remove: true,
                    })
                    await Swal.fire({
                        icon: 'success',
                        title: 'ลบสำเร็จ',
                        text: 'ลบผู้ใช้งานเรียบร้อยแล้ว'
                    })
                    this.$router.push('/backoffice/personnel')
                } catch (error) {
                    console.error('deleteUser error:', error)
                    Swal.fire({
                        icon: 'error',
                        title: 'ลบไม่สำเร็จ',
                        text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
                    })
                }
            },
            cancel(){
                 this.$router.push('/backoffice/personnel')
            }
        }
    }
</script>
<style>
    .box-button .v-toolbar__content{
        justify-content: center;
    }
    .style-card{
        box-shadow: none;
    }
    .btn-delete{
        color: white!important;
    }
</style>
