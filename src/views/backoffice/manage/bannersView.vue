<template>
  <div class="announce-view">
    <breadcrumbsView :items="item"/>

    <!-- รายการช่องทางการสร้างแบนเนอร์-->
    <v-data-table
      :headers="headers"
      :items="dataBanners"
      :loading="loading"
      loading-text="Loading... Please wait"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>ช่องทางการสร้างแบนเนอร์</v-toolbar-title>
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
      <template v-slot:[`item.banner_name`]="{ item }">
        <div class="overflow-630" >{{ item.banner_name }}</div>
      </template>
      <template v-slot:[`item.start_date`]="{ item }">
        <div class="overflow-160" >{{getThaiDate(item.start_date)}}</div>
      </template>
      <template v-slot:[`item.end_date`]="{ item }">
        <div class="overflow-160" >{{getThaiDate(item.end_date)}}</div>
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
          <v-btn color="#003366" icon size="small" @click="editBanner(item)">
            <i class="f-16 fa-solid fa-pen-to-square"></i>
          </v-btn>
          <v-btn color="#003366" icon size="small" @click="removeBanner(item)">
            <i class="fa-solid fa-trash"></i>
          </v-btn>
      </template>
    </v-data-table>

    <!-- form การเพิ่ม-แก้ไข ข้อมูล -->
    <v-dialog v-model="dialogCreate" max-width="700px" persistent>
      <v-card>
        <v-toolbar color="#167dc2" class="mb-4" theme="dark">
          <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>

          <v-overlay v-if="loaderData" model-value contained class="align-center justify-center">
            <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
          </v-overlay>

          <v-form ref="formBanner" v-model="valid">
            <p class="style-label mt-2"><span>*</span>ชื่อแบนเนอร์</p>
            <v-text-field
              v-model="dataDailogBanner.banner_name"
              :rules="bannerRules"
              label="ชื่อแบนเนอร์"
              density="compact"
              variant="outlined"
              hide-details="auto"
              :maxlength="maxLengthTwoHundredFiftyFive"
              @input="checkRulesLength(dataDailogBanner.banner_name.length, maxLengthTwoHundredFiftyFive)"
            ></v-text-field>

            <p class="style-label mt-2"><span>*</span>ไฟล์เเนบ : (เเนบไฟล์ png, jpeg, gif ขนาดไม่เกิน 900px * 900px) </p>
            <v-file-input
              v-if="dataDailogBanner.file_original == null"
              show-size
              label="เลือกไฟล์"
              variant="outlined"
              density="compact"
              clearable
              v-model="dataDailogBanner.file"
              :accept="acceptTypes"
              :rules="fileRules"
            ></v-file-input>

            <div v-else class="text-left">
              <v-chip class="ma-2" closable>
                <v-icon v-if="dataDailogBanner.file_type == 'application/pdf'" icon="mdi-file" @click="showFile(dataDailogBanner.file_type, dataDailogBanner.file_name, 'UrlFilesBanner')"></v-icon>
                <v-icon v-else icon="mdi-image" @click="showFile(dataDailogBanner.file_type, dataDailogBanner.file_name, 'UrlFilesBanner')"></v-icon>
                &nbsp;{{dataDailogBanner.file_original}}
              </v-chip>
              <v-btn color="#003366" icon size="small" @click="removeFile(dataDailogBanner)">
                  <i class="fa-solid fa-trash"></i>
              </v-btn>
            </div>

            <v-row>
              <v-col>
                  <p class="style-label"><span>*</span>วันที่เริ่มต้น</p>
                  <DateField v-model="start_date" label="ตั้งเเต่วันที่" />
              </v-col>
              <v-col>
                  <p class="style-label"><span>*</span>วันที่สิ้นสุด </p>
                  <DateField v-model="end_date" :min="start_date" label="ตั้งเเต่วันที่" />
              </v-col>
            </v-row>
          </v-form>

          <v-card-actions class="px-0 py-0 mt-4">
            <v-spacer></v-spacer>
            <v-btn class="btn btn-submit" variant="text" @click="saveBanner">บันทึก</v-btn>
            <v-btn class="btn btn-cancel" variant="text" @click="closeDailogCreate">ยกเลิก</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- โชว์รูป  -->
    <v-overlay v-model="overlayImg" class="style-bg align-center justify-center" :contained="absolute">
      <img :src="url" />
      <v-btn class="btn-overlay" icon @click="overlayImg = false">
        <v-icon icon="fa-solid fa-xmark" color="white" />
      </v-btn>
    </v-overlay>
  </div>
</template>

<script>
  import breadcrumbsView from '@/components/breadcrumbsView.vue';
  import DateField from '@/components/DateField.vue';
  import store from '../../../store/index.js';
  import Swal from 'sweetalert2';
  import moment from 'moment';
  import axios from "axios";
  export default {
    components: { breadcrumbsView, DateField },

    data: () => ({
      check_roles: store.getters.user,
      loading : true,
      loaderData : false,
      date : moment().format('YYYY-MM-DD HH:mm:ss'),
      value: '',
      item: [
        { text: 'ตั้งค่า', disabled: false, href: '/backoffice/manage' },
        { text: 'ช่องทางสร้างแบนเนอร์', disabled: true, href: 'breadcrumbs_link_1' },
      ],
      headers: [
        { title: 'วันที่จัดทำ', key: 'create_date', align: 'center'},
        { title: 'ชื่อแบนเนอร์', key: 'banner_name' },
        { title: 'วันที่เริ่มต้น', key: 'start_date' },
        { title: 'วันที่สิ้นสุด', key: 'end_date' },
        { title: 'สถานะการใช้งาน', key: 'status' },
        { title: '', key: 'actions', align: 'center', sortable: false },
      ],
      valid: true,
      url: '',
      opacity: 1,
      absolute: false,
      overlayImg: false,
      dataBanners:[],
      dataDailogBanner: {},
      titleBanner: -1,
      dialogCreate: false,
      bannerId: null,
      start_date: new Date().toISOString().substr(0, 10),
      end_date: new Date().toISOString().substr(0, 10),
      maxLengthTwoHundredFiftyFive: 255,
      status: true,
      checkRemove: false,
      acceptTypes: "image/*, application/pdf",
      bannerRules: [
        v => !!v || 'กรุณากรอกข้อมูล',
      ],
      fileRules: [
        value => {
          if (!value || value.length === 0) {
              return "กรุณาอัพโหลดไฟล์";
          }
          const maxFileSize = 10 * 1024 * 1024;
          for (let i = 0; i < value.length; i++) {
              if (value[i].size > maxFileSize) {
                  return 'อัพโหลดไฟล์ขนาดไม่เกิน 10 mb';
              }else{
                  return true;
              }
          }
          const allowedTypes = ["image/png", "image/jpeg", "image/gif"];
          if (!allowedTypes.includes(value.type)) {
              return "ประเภทไฟล์ที่อัพโหลดไม่ถูกต้อง";
              }
          return true;
        }
      ],
    }),

    mounted(){
      this.getBanner()
    },

    watch: {
      start_date(v){
        if (this.end_date < v) {
          this.end_date = v
        }
      },
    },

    computed: {
      formTitle () {
        return this.titleBanner === -1 ? 'สร้างรายการ' : 'แก้ไขรายการ'
      }
    },

    methods:{
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
      showFile(file_type, file_name, urlFiles){
        if(file_type == 'application/pdf'){
          this.urlPdfFiles(urlFiles, file_name)
        }else{
          this.urlFiles(urlFiles, file_name)
        }
      },
      fetchData() {
        this.loaderData = true;
        setTimeout(() => {
          this.loaderData = false;
        }, 1000);
      },
      closeDailogCreate () {
        this.dialogCreate = false
        this.titleBanner = -1
        this.dataDailogBanner = {}
        this.checkRemoveFile = false
        this.$refs.formBanner.resetValidation()
      },
      async getBanner(){
        try {
          let path         = `/api/backoffice/get/banner`
          let response     = await axios.get(`${path}`)
          this.dataBanners = response.data.data
          this.loading     = false
        } catch (error) {
          if (error.response?.status === 401) {
            this.$router.push('/backoffice/login');
          } else {
            console.log('getBanner');
          }
        }
      },
      async saveBanner(){
        const { valid } = await this.$refs.formBanner.validate()
        if (valid) {
          try {
            let fd = {};
            let path = null;

            if(this.titleBanner === -1){
              fd = {
                "banner_name"               : this.dataDailogBanner.banner_name,
                "file_original"             : this.dataDailogBanner.file.name,
                "file_type"                 : this.dataDailogBanner.file.type,
                "start_date"                : this.start_date,
                "end_date"                  : this.end_date,
                "check_remove"              : false,
                "status"                    : this.status,
                "create_by"                 : this.check_roles.id,
              }
              path = `/api/backoffice/create/banner`
            }else{
              fd = {
                "banner_id"               : this.dataDailogBanner.id,
                "banner_name"             : this.dataDailogBanner.banner_name,
                "file_original"           : this.dataDailogBanner.file !== undefined ? this.dataDailogBanner.file.name : this.dataDailogBanner.file_original,
                "file_name"               : this.dataDailogBanner.file !== undefined ? null : this.dataDailogBanner.file_name,
                "file_type"               : this.dataDailogBanner.file !== undefined ? this.dataDailogBanner.file.type : this.dataDailogBanner.file_type,
                "start_date"              : `${moment(this.start_date).format('YYYY-MM-DD')}`,
                "end_date"                : `${moment(this.end_date).format('YYYY-MM-DD')}`,
                "roles_id"                : this.check_roles.id,
              }
              path = `/api/backoffice/edit/banner`
            }

            console.log(fd);
            let response = await axios.post(`${path}`, fd)

            if(response && this.dataDailogBanner.file !== undefined){
                const formData = new FormData();
                formData.append('id', response.data.banner_id);
                formData.append('types', 'Banner');
                formData.append('files', this.dataDailogBanner.file);
                formData.append('file_name', response.data.file_name);
                await axios.post('/api/uploadsFile', formData)
            }

            await Swal.fire({
              icon: 'success',
              title: 'บันทึกสำเร็จ',
              text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
            })

            await this.closeDailogCreate()
            await this.getBanner()

          } catch (error) {
            if (error.response?.status === 401) {
              this.$router.push('/backoffice/login');
            } else {
              console.log('saveBanner' + error);
            }
          }
        }
      },
      async editBanner(value){
        await this.fetchData();
        this.dialogCreate           = true;
        this.titleBanner            = 0;
        this.dataDailogBanner       = JSON.parse(JSON.stringify(value));
        this.bannerId               = value.id;
        this.start_date             = value.start_date;
        this.end_date               = value.end_date;
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
              console.log(payload);
              let path      = `/api/backoffice/update/bannersStatus`
              let response = await axios.post(`${path}`, payload)
              console.log(response);
              if(payload){
                  Swal.fire({ icon: 'success', text: 'บันทึกข้อมูลเรีบร้อยเเล้ว' })
                  await this.getBanner()
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
      async removeBanner(v){
        try {
          await Swal.fire({
              title: 'คำเตือน',
              text: "คุณต้องการลบรายการแบนเนอร์ใช่หรือไม่ ?",
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
                      let path =  `/api/backoffice/update/deleteBanner`
                      let response = await axios.post(`${path}`, payload)
                      if(response){
                          await Swal.fire({ icon: 'success', text: 'ลบข้อมูลสำเร็จ' })
                      }
                      await this.getBanner()
                      await this.closeDailogCreate()
                  }
              })
        } catch (error) {
          await Swal.fire({
            icon: 'error',
            title: 'บันทึกไม่สำเร็จ',
            text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
          })
          console.log('removeBanner',error);
        }
      },
      async removeFile(v){
        try {
          await Swal.fire({
            title: 'คำเตือน',
            text: "คุณต้องการลบเอกสารแนบใช่หรือไม่ ?",
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
                      file_original : null,
                      file_name : null,
                      file_type : null,
                      admin_id : this.check_roles.id,
                  }
                  let path =  `/api/backoffice/update/deleteBannerFile`
                  let response = await axios.post(`${path}`, payload)
                  if(response){
                      await Swal.fire({ icon: 'success', text: 'ลบข้อมูลสำเร็จ' })
                  }
                  this.dataDailogBanner.file_original = null
                  this.dataDailogBanner.file_name = null
                  this.dataDailogBanner.file_type = null
                  await this.getBanner()
              }
          })
        } catch (error) {
          await Swal.fire({
            icon: 'error',
            title: 'บันทึกไม่สำเร็จ',
            text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
          })
          console.log('removeFileBanner',error);
        }
      },
      async urlPdfFiles(url,file_name){
        axios({
            url: `/api/get/pdf/${url}`,
            params: {"filename":file_name},
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
              var fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
              var fileLink = document.createElement('a');
              fileLink.href = fileURL;
              fileLink.setAttribute('download', file_name);
              document.body.appendChild(fileLink);
              window.open(fileLink, "_blank");
        });
      },
      async urlFiles(url,file_name){
        let path = `/api/get/${url}?filename=${file_name}`
        let res = await axios.get(`${path}`, { responseType: 'blob' })
        this.url = window.URL.createObjectURL(res.data)
        this.overlayImg = !this.overlayImg
      },
    }
  }
</script>
<style></style>
