<template>
  <div class="user-view">
      <div class="style-page">
        <v-data-table
          :headers="headers"
          :items="check_datas"
          :search="search"
          :loading="loadTable"
          loading-text="Loading..."
          class="table-none"
        >
          <template v-slot:top>
            <v-toolbar flat class="table-head">
              <v-toolbar-title class="mr-2">รายการบุคลากร</v-toolbar-title>
              <v-btn
                class="btn-create mb"
                @click="create"
              >
                <i class="fa-solid fa-plus icon-style mr-1"></i>
                เพิ่มรายการใหม่
              </v-btn>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-inner-icon="mdi-magnify"
                label="ค้นหา (ชื่อ-สกุล, ตำแหน่ง, ระดับการใช้งาน)"
                variant="underlined"
                hide-details
              ></v-text-field>
            </v-toolbar>
          </template>
          <template v-slot:[`item.create_date`]="{ item }">{{getThaiDate(item.create_date)}}</template>
          <template v-slot:[`item.name`]="{ item }">{{item.name + ' ' + item.lastname}}</template>
          <template v-slot:[`item.roles`]="{ item }">{{typeRoles(item.roles)}}</template>
          <template v-slot:[`item.status`]="{ item }"><span :class="item.status == 0 ?'text-red':''">{{item.status == 1 ? 'ใช้งาน' : 'ไม่ใช้งาน'}}</span></template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn
              color="#003366"
              icon
              size="small"
              @click="editItem(item)"
            >
              <i class="f-16 fa-solid fa-pen-to-square"></i>
            </v-btn>
          </template>
        </v-data-table>
      </div>
    </div>
  </template>
  <script>
  import  axios  from "axios";

    export default {

      data: () => ({
        dialog: false,
        dialogDelete: false,
        search: '',
        loadTable: true,
        headers: [
          { title: 'วันที่จัดทำ', key: 'create_date', align: 'center'},
          { title: 'ชื่อ-สกุล', key: 'name' },
          { title: 'ตำเเหน่ง', key: 'position' },
          { title: 'ระดับการใช้งาน', key: 'roles', align: 'center'},
          { title: 'สถานะ', key: 'status', align: 'center'},
          { title: 'แก้ไข', key: 'actions', align: 'center', sortable: false },
        ],
        datas_user: [],
        checkbox: false,
        check_datas : [],
      }),

      created () {
        this.getUser()
      },

      methods: {
        getThaiDate(item){
          if (item){
            var d = new Date(item);
            return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
          }else{
            return "";
          }
        },
        typeRoles(type){
          if(type == 'general'){
            return 'เจ้าหน้าที่รับเรื่อง';
          }else if(type == 'admin'){
            return 'ผู้ดูเเลระบบ';
          }else if(type == 'vip'){
            return 'ผู้ใช้งานระดับสูง';
          }else{
            return "";
          }
        },

        async getUser () {
          try {
            let path        = `/api/backoffice/get/listUser`
            let response    = await axios.get(`${path}`)
            this.datas_user = response.data.data
            this.checkState(this.datas_user)
            this.loadTable = false;
          } catch (error) {
            if (error.response?.status === 401) {
              this.$router.push('/backoffice/login');
            } else {
              console.log('getUser');
            }
          }
        },
        checkState(v){
          const datas = v
          if(!this.checkbox){
            const result = datas.filter(data => data.status == 1);
            this.check_datas = result
          }else{
            this.check_datas = this.datas_user
          }
        },

        create(){
          this.$router.push({ name: 'personnel_form', params: { title: 'create' } })
        },
        editItem (item) {
          this.$router.push({ name: 'personnel_formedit', params: { id: item.id },})
        },
      },
    }
  </script>
  <style scoped>
      .v-data-table-header{
          background-color: #0170c2;
      }
      th span{
             color: white!important;
      }
      .title-festival{
          border-bottom: 2px solid #0170c2;
      }
      .btn-create{
          background-color: #213862!important;
          border: 1px solid #213862;
          color: white!important;
      }
      .btn-submit{
          background-color: #0170c2;
          border: 1px solid #0170c2;
          color: white!important;
      }
      .btn-cancel{
          color: #0170c2!important;
          border: 1px solid #0170c2;
          margin-right: 0.5rem;
      }
  </style>
