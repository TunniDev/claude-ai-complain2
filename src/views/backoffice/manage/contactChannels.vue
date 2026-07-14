<template>
  <div class="reply-message">
    <BreadcrumbsView :items="item"/>

    <!-- รายการช่องทางการติดต่อ -->
    <v-data-table
      :headers="headers"
      :items="dataContactChannels"
      :loading="loading"
      loading-text="Loading... Please wait"
      class="elevation-1"
    >
      <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>ช่องทางการติดต่อ</v-toolbar-title>
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
      <template v-slot:[`item.contact_name`]="{ item }">
        <div class="overflow-630" >{{ item.contact_name }}</div>
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
          <v-btn color="#003366" icon size="small" @click="editContactChannels(item)">
            <i class="f-16 fa-solid fa-pen-to-square"></i>
          </v-btn>
          <v-btn color="#003366" icon size="small" @click="removeContactChannels(item)">
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
          <v-form ref="formContactChannels" v-model="valid">
              <p class="style-label"><span>*</span>ชื่อช่องทางการติดต่อ</p>
              <v-text-field
                  v-model="contactName"
                  :rules="contactRules"
                  label="ชื่อช่องทางการติดต่อ"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  :maxlength="maxLengthTwoHundred"
                  @input="checkRulesLength(contactName.length, maxLengthTwoHundred)"
              ></v-text-field>

              <p class="style-label mt-2"><span>*</span>ลิ้งค์ติดต่อ</p>
              <v-text-field
                  v-model="contactLink"
                  :rules="contactRules"
                  label="ลิ้งค์ติดต่อ"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  :maxlength="maxLengthTwoHundred"
                  @input="checkRulesLength(contactLink.length, maxLengthTwoHundred)"
              ></v-text-field>
          </v-form>

          <v-card-actions class="px-0 py-0 mt-4">
            <v-spacer></v-spacer>
            <v-btn class="btn btn-submit" variant="text" @click="saveContactChannels">บันทึก</v-btn>
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
        titleContactChannels: -1,
        valid: true,
        loading: true,
        dialogCreate: false,
        dataContactChannels: [],
        date : moment().format('YYYY-MM-DD HH:mm:ss'),
        maxLengthTwoHundred: 200,
        id: null,
        status: false,
        contactName: '',
        contactLink: '',
        checkRemove: false,
        contactRules: [
            v => !!v || 'กรุณากรอกข้อมูล',
            v => (v && v.length <= 200) || 'กรอกรายละเอียดห้ามเกิน 200 ตัวอักษร',
        ],
      dialogDelete: false,
      item: [
        { text: 'ตั้งค่า', disabled: false, href: '/backoffice/manage' },
        { text: 'ช่องทางการติดต่อ', disabled: true, href: 'breadcrumbs_link_1' },
      ],
      headers: [
        { title: 'วันที่จัดทำ', key: 'create_date', align: 'center'},
        { title: 'ช่องทางการติดต่อ', key: 'contact_name' },
        { title: 'สถานะการใช้งาน', key: 'status' },
        { title: '', key: 'actions', align: 'center', sortable: false },
      ],
    }),

    mounted(){
      this.getContactChannels();
    },

    computed: {
      formTitle () {
        return this.titleContactChannels === -1 ? 'สร้างรายการ' : 'แก้ไขรายการ'
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
        this.dialogCreate         = false
        this.titleContactChannels = -1
        this.contactName          = ''
        this.contactLink          = ''
        this.$refs.formContactChannels.resetValidation()
      },
      async getContactChannels(){
        try {
          let path                  = `/api/backoffice/get/contactChannels`
          let response              = await axios.get(`${path}`)
          this.dataContactChannels  = response.data.data
          this.loading              = false
        } catch (error) {
          if (error.response?.status === 401) {
            this.$router.push('/backoffice/login');
          } else {
            console.log('getContactChannels');
          }
        }
      },
      async editContactChannels(value){
        this.dialogCreate           = true;
        this.titleContactChannels   = 0;
        this.id                     = value.id;
        this.contactName            = value.contact_name;
        this.contactLink            = value.contact_link;
      },
      async saveContactChannels(){
        const { valid } = await this.$refs.formContactChannels.validate()
        if (valid) {
          try {
            let fd = {}
            let path = null

            if(this.titleContactChannels === -1){
              fd = {
                "contact_name"    : this.contactName,
                "contact_link"    : this.contactLink,
                "status"          : true,
                "check_remove"    : this.checkRemove,
                "create_by"       : this.check_roles.id,
                "create_date"     : this.date,
                "modified_by"     : this.check_roles.id,
                "modified_date"   : this.date,
              }
              path        = `/api/backoffice/create/contactChannels`
            }else{
              fd = {
                "id"              : this.id,
                "contact_name"    : this.contactName,
                "contact_link"    : this.contactLink,
                "modified_by"     : this.check_roles.id,
              }
              path        = `/api/backoffice/edit/contactChannels`
            }

            await axios.post(`${path}`, fd)

            await Swal.fire({
              icon: 'success',
              title: 'บันทึกสำเร็จ',
              text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
            })

            await this.closeDailogCreate()
            await this.getContactChannels()

            } catch (error) {
              console.log('saveContactChannels', error);
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
            let path      = `/api/backoffice/update/contactChannelsStatus`
            await axios.post(`${path}`, payload)
            if(payload){
              Swal.fire({ icon: 'success', text: 'บันทึกข้อมูลเรีบร้อยเเล้ว' })
              await this.getContactChannels()
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
      async removeContactChannels(v){
        try {
          await Swal.fire({
            title: 'คำเตือน',
            text: "คุณต้องการลบรายการช่องทางการติดต่อใช่หรือไม่ ?",
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
              let path =  `/api/backoffice/update/deleteContactChannels`
              let response = await axios.post(`${path}`, payload)
              if(response){
                await Swal.fire({ icon: 'success', text: 'ลบข้อมูลสำเร็จ' })
              }
              await this.getContactChannels()
            }
          })
        } catch (error) {
          await Swal.fire({
            icon: 'error',
            title: 'บันทึกไม่สำเร็จ',
            text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
          })
          console.log('removeContactChannels',error);
        }
      }
    }
  }
</script>
<style scoped>
  .box-card {
    background-color: #fff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
</style>
