<template>
  <div class="reply-message">
    <BreadcrumbsView :items="item"/>

     <!-- รายการข้อความตอบกลับผู้ใช้งาน-->
    <v-data-table
      :headers="headers"
      :items="dataReplyMessage"
      :loading="loading"
      loading-text="Loading... Please wait"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>ข้อความตอบกลับผู้ใช้งาน</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="#213862" class="mb-2" @click="dialogCreate = true">
              <i class="fa-solid fa-plus icon-style"></i>
              เพิ่มรายการใหม่
          </v-btn>
        </v-toolbar>
      </template>

      <template v-slot:[`item.create_date`]="{ item }">
        <div class="overflow-160" >{{getThaiDate(item.create_date)}}</div>
      </template>
      <template v-slot:[`item.message_detail`]="{ item }">
        <div class="overflow-630" >{{ item.message_detail }}</div>
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <div class="overflow-160" >
          <v-switch
            color="primary"
            @click="toggleStatus(item)"
            v-model="item.status"
            :label="`${item.status == true ? 'ใช้งาน' : 'ไม่ใช้งาน'}`"
            hide-details
          ></v-switch>
        </div>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="#003366" icon size="small" @click="editReplyMessage(item)">
            <i class="f-16 fa-solid fa-pen-to-square"></i>
          </v-btn>
          <v-btn color="#003366" icon size="small" @click="removeReplyMessage(item)">
            <i class="fa-solid fa-trash"></i>
          </v-btn>
      </template>
    </v-data-table>

    <!-- form การเพิ่ม-แก้ไข ข้อมูล -->
    <v-dialog v-model="dialogCreate" max-width="500px" persistent>
      <v-card>
        <v-toolbar color="#167dc2" class="mb-4" theme="dark">
          <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form ref="formReplyMessage" v-model="valid">
            <p class="style-label"><span>*</span>รายละเอียดข้อความตอบกลับผู้ใช้งาน</p>
            <v-textarea
                v-model="messageDetail"
                :rules="messageDetailRules"
                hide-details="auto"
                variant="outlined"
                :maxlength="maxLengthTwoHundred"
                @input="checkRulesLength(messageDetail.length, maxLengthTwoHundred)"
            ></v-textarea>
            <v-checkbox
              v-model="CheckmessageOther"
              label="เพิ่มช่องกรอกรายละเอียดข้อความอื่นๆ"
              hide-details
            ></v-checkbox>
          </v-form>

          <v-card-actions class="px-0 py-0 mt-4">
            <v-spacer></v-spacer>
            <v-btn class="btn btn-submit" variant="text" @click="saveReplyMessage">บันทึก</v-btn>
            <v-btn class="btn btn-cancel" variant="text" @click="closeDailogCreate">ยกเลิก</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import BreadcrumbsView from '@/components/breadcrumbsView.vue';
  import store from '../../../store/index.js';
  import Swal from 'sweetalert2';
  import moment from 'moment';
  import 'moment/locale/th';
  import axios from "axios";
  export default {
    components: { BreadcrumbsView},

    data: () => ({
      check_roles: store.getters.user,
      valid: true,
      loading: true,
      dialogCreate: false,
      dataReplyMessage: [],
      CheckmessageOther: false,
      date : moment().format('YYYY-MM-DD HH:mm:ss'),
      maxLengthTwoHundred: 200,
      id: null,
      status: false,
      messageDetail: '',
      checkRemove: false,
      messageDetailRules: [
          v => !!v || 'กรุณากรอกข้อมูล',
          v => (v && v.length <= 200) || 'กรอกรายละเอียดห้ามเกิน 200 ตัวอักษร',
      ],
      dialogDelete: false,
      item: [
        { text: 'ตั้งค่า', disabled: false, href: '/backoffice/manage' },
        { text: 'ข้อความตอบกลับผู้ใช้งาน', disabled: true, href: 'breadcrumbs_link_1' },
      ],
      headers: [
        { title: 'วันที่จัดทำ', key: 'create_date', align: 'center'},
        { title: 'รายการ', key: 'message_detail' },
        { title: 'สถานะการใช้งาน', key: 'status' },
        { title: '', key: 'actions', align: 'center', sortable: false },
      ],
      desserts: [],
      titleReplyMessage: -1,
    }),

    mounted(){
      this.getReplyMessage();
    },

    computed: {
      formTitle () {
        return this.titleReplyMessage === -1 ? 'สร้างรายการ' : 'แก้ไขรายการ'
      },
    },

    methods: {
      checkRulesLength(valueLength, maxLength){
        if(valueLength === maxLength){
            Swal.fire(`กรอกได้ไม่เกิน ${maxLength} ตัวอักษร`)
        }
      },
      getThaiDate(value){
        if (value){
          var d = new Date(value);
          return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
        }else{
          return "";
        }
      },
      closeDailogCreate () {
        this.dialogCreate       = false
        this.titleReplyMessage  = -1
        this.messageDetail      = ''
        this.CheckmessageOther  = false
        this.$refs.formReplyMessage.resetValidation()
      },
      async getReplyMessage(){
        try {
          let path                = `/api/backoffice/get/replyMessage`
          let response            = await axios.get(`${path}`)
          this.dataReplyMessage   = response.data.data
          this.loading            = false
        } catch (error) {
          if (error.response?.status === 401) {
            this.$router.push('/backoffice/login');
          } else {
            console.log('getReplyMessage');
          }
        }
      },
      async editReplyMessage(value){
        this.dialogCreate       = true;
        this.titleReplyMessage  = 0;
        this.id                 = value.id;
        this.messageDetail      = value.message_detail;
        this.CheckmessageOther  = value.message_detail_other;
      },
      async saveReplyMessage(){
        const { valid } = await this.$refs.formReplyMessage.validate()
        if (valid) {
          try {
            let fd = {}
            let path = null

            if(this.titleReplyMessage === -1){
              fd = {
                "message_detail"          : this.messageDetail,
                "message_detail_other"    : this.CheckmessageOther,
                "status"                  : true,
                "check_remove"            : this.checkRemove,
                "create_by"               : this.check_roles.id,
                "create_date"             : this.date,
                "modified_by"             : this.check_roles.id,
                "modified_date"           : this.date,
              }
              path        = `/api/backoffice/create/replyMessage`
            }else{
              fd = {
                "id"                      : this.id,
                "message_detail"          : this.messageDetail,
                "message_detail_other"    : this.CheckmessageOther,
                "modified_by"             : this.check_roles.id,
              }
              path        = `/api/backoffice/edit/replyMessage`
            }

            await axios.post(`${path}`, fd)

            await Swal.fire({
              icon: 'success',
              title: 'บันทึกสำเร็จ',
              text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
            })

            await this.closeDailogCreate()
            await this.getReplyMessage()

          } catch (error) {
            console.log('saveReplyMessage', error);
          }
        }
      },
      async toggleStatus(v){
        Swal.fire({
        title: 'คำเตือน',
        text: "คุณต้องการเปลี่ยนสถานะรายการใช่หรือไม่ ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
        }).then(async (result) => {
          if (result.isConfirmed) {
            const payload = {
                id                 : v.id,
                admin_id           : this.check_roles.id,
                status             : v.status ? true : false
            }
            let path      = `/api/backoffice/update/replyMessageStatus`
            await axios.post(`${path}`, payload)
            if(payload){
              Swal.fire({ icon: 'success', text: 'บันทึกข้อมูลเรีบร้อยเเล้ว' })
              await this.getReplyMessage()
            }else{
              Swal.fire({
                  icon: 'error',
                  title: 'บันทึกไม่สำเร็จ',
                  text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
              })
            }
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            v.status == true ? v.status = false : v.status = true
          }
        })
      },
      async removeReplyMessage(v){
        try {
          await Swal.fire({
            title: 'คำเตือน',
            text: "คุณต้องการลบรายการข้อความตอบกลับผู้ใช้งานใช่หรือไม่ ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่',
            cancelButtonText: 'ยกเลิก',
          }).then(async (result) => {
            if (result.isConfirmed) {
              const payload = {
                  id : v.id,
                  admin_id : this.check_roles.id,
                  check_remove : true,
              }
              let path =  `/api/backoffice/update/deleteReplyMessage`
              let response = await axios.post(`${path}`, payload)
              if(response){
                await Swal.fire({ icon: 'success', text: 'ลบข้อมูลสำเร็จ' })
              }
              await this.getReplyMessage();
            }
          })
        } catch (error) {
          await Swal.fire({
            icon: 'error',
            title: 'บันทึกไม่สำเร็จ',
            text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
          })
          console.log('removeReplyMessage',error);
        }
      },
    },
  }
</script>

<style>
    .box-card {
      background-color: #fff;
      padding: 20px;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
</style>
