<template>
    <div class="receive-complain">
      <div class="style-page">
        <v-card class="style-card">
          <v-card-title>
              เเสดงรายการปัญหา
              <v-spacer></v-spacer>
              <v-text-field
                  v-model="search"
                  append-inner-icon="mdi-magnify"
                  label="ค้นหา (Call No, หัวข้อปัญหา)"
                  variant="underlined"
                  hide-details
              ></v-text-field>
          </v-card-title>
          <v-data-table
              :headers="headers"
              :items="datas"
              :search="search"
              :loading="loading"
              loading-text="Loading... Please wait"
          >
            <template v-slot:[`item.call_no`]="{ item }">{{ item.call_no }}</template>
            <template v-slot:[`item.topic`]="{ item }">
              <div class="overflow" >{{ item.topic }}</div>
            </template>
            <template v-slot:[`item.start_date`]="{ item }">{{getThaiDate(item.start_date)}}</template>
            <template v-slot:[`item.end_date`]="{ item }">{{getThaiDate(item.end_date)}}</template>
            <template v-slot:[`item.status_call`]="{ item }">
                <v-chip
                :color="getColor(item.status_call)"
                variant="flat"
                >
                {{ item.status_call  == 0 ? 'รอรับเรื่อง' : '' }}
                </v-chip>
            </template>
            <template v-slot:[`item.action`]="{ item }">
              <router-link :to="{ name: 'receive-detail', params: { id: item.id }}">
                <i class="f-16 fa-solid fa-magnifying-glass"></i>
              </router-link>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </div>
  </template>
  <script>
  import axios from "axios";
  import moment from 'moment';
  import 'moment/locale/th';
  import store from '../../../store/index.js';

  export default {
  components: {},
    data () {
      return {
        check_roles: store.getters.user,
        search: '',
        loading: true,
        datas: [],
        headers: [
          { title: 'Call No', align: 'center', key: 'call_no' },
          { title: 'หัวข้อปัญหา', align: 'start', sortable: false, key: 'topic' },
          { title: 'วันที่เริ่มต้น', key: 'start_date' },
          { title: 'วันที่สิ้นสุด', key: 'end_date' },
          { title: 'สถานะ Call', key: 'status_call' },
          { title: 'Action', align: 'center', key: 'action' },
        ],
        desserts: [],
      }
    },
    mounted(){
      this.getListComplain()
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
      timeFormat:function(d){
        let time =  moment(d).utcOffset("+00:00").format('HH:mm') == '00:00' ? '' : moment(d).utcOffset("+00:00").format('HH:mm')
          return time;
      },
      getColor (status_call) {
        if (status_call > 400) return 'red'
        else if (status_call > 200) return 'orange'
        else return '#a19d9d'
      },
      formattedDate(create_date) {
        return moment(create_date).add(543, 'year').format("DD/MM/YYYY HH:mm:ss");
      },
      async getListComplain(){
        try {
          let path = `/api/backoffice/get/listComplain`
          let response =  await axios.get(`${path}/`)
          this.datas = response.data.data
          this.loading = false
        } catch (error) {
          if (error.response?.status === 401) {
            this.$router.push('/backoffice/login');
          } else {
            console.log('getListComplain');
          }
        }
      },
    },
  }
  </script>
  <style>
  .style-card{
  box-shadow: none!important;
  }
  </style>
