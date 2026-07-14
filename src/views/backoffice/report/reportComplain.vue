<template>
  <div class="report-complain">
    <div class="style-page">
      <div>
        <v-data-table :headers="headers" :items="filteredItems" hide-default-footer :loading="loading" loading-text="Loading... Please wait">
        <template v-slot:top>
            <v-toolbar flat class="table-head">
              <v-toolbar-title class="mr-2">รายงานสรุปเเจ้งเรื่องร้องเรียน</v-toolbar-title>
                <div> <ExportExcel :datas="filteredItems" :columns="columns" filename="test"/></div>
              </v-toolbar>
              <v-row>
                <v-col cols>
                  <selectStatus ref="filter_status" :itemsStatus="itemsStatus"/>
                </v-col>
                <v-col cols>
                  <DatePickers @change_date="changeStartDate" @change_end_date="changeEndDate"/>
                </v-col>
              </v-row>
        </template>

        <template v-slot:[`item.topic`]="{ item }">
          <div class="overflow-160" >{{ item.topic }}</div>
        </template>
        <template v-slot:[`item.division`]="{ item }">
          <div class="overflow-160" >{{ item.division }}</div>
        </template>
        <template v-slot:[`item.name`]="{ item }"><div class="overflow-160" >{{ item.name }} {{ item.lastname }}</div></template>
        <template v-slot:[`item.create_date`]="{ item }">{{ item.dataCreateDate }}</template>
        <template v-slot:[`item.date`]="{ item }">{{ item.dataDate }}</template>
        <template v-slot:[`item.status_call`]="{ item }">{{ item.dataStatus }}</template>
        <template v-slot:[`item.admin_id`]="{ item }"> <div class="overflow-160" >{{ item.dataAdminName }}</div></template>
    </v-data-table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import selectStatus from '@/components/selectStatus.vue';
import DatePickers from '@/components/datePickers.vue';
import ExportExcel from '@/components/exportExcel.vue';
export default {
  components: { selectStatus, DatePickers, ExportExcel},
  data() {
    return {
      loading: true,
      headers: [
        { title: 'Call No', key: 'call_no' },
        { title: 'วันที่บันทึกปัญหา', key: 'create_date' },
        { title: 'เรื่อง', key: 'topic' },
        { title: 'เจ้าหน้าที่ที่ร้องเรียน', key: 'name' },
        { title: 'หน่วยงาน', key: 'division' },
        { title: 'ช่วงวันเกิดเหตุ', key: 'date' },
        { title: 'สถานะ', key: 'status_call' },
        { title: 'เจ้าหน้าที่รับเรื่อง', key: 'admin_id' },
      ],
      items: [],
      dataExport: [],
      itemsStatus: [
        { value: 'ทั้งหมด', id: null },
        { value: 'รับเรื่อง', id: 1 },
        { value: 'ไม่รับเรื่อง', id: 2 },
        { value: 'อยู่ระหว่างดำเนินการ', id: 3 },
        { value: 'สอบถามข้อมูลเพิ่มเติม', id: 4 },
        { value: 'เรื่องเสร็จ', id: 5 },
      ],
      getStartDate: null,
      getEndDate: null,
      columns: [
        { label: 'Call No', field: 'call_no' },
        { label: 'วันที่บันทึกปัญหา', field: 'dataCreateDate' },
        { label: 'เรื่อง', field: 'topic' },
        { label: 'เจ้าหน้าที่ที่ร้องเรียน', field: 'name' },
        { label: 'หน่วยงาน', field: 'division' },
        { label: 'ช่วงวันเกิดเหตุ', field: 'dataDate' },
        { label: 'สถานะ', field: 'dataStatus' },
        { label: 'เจ้าหน้าที่รับเรื่อง', field: 'dataAdminName' },
      ],
    };
  },
  mounted(){
    this.getReportComplain()
  },
  computed: {
    filteredItems() {
      return this.items.filter(item => {
        const status_call = this.getstatus(item.status_call)
        const itemDate = item.create_date;
        const startDate = this.getStartDate;
        const endDate = this.getEndDate;
        item["dataStatus"] = status_call;
        item["dataAdminName"] = `${item.adminName + ' ' + item.adminLastname}`;
        item["dataDate"] = `${this.getThaiDate(item.start_date) +' ถึง ' + this.getThaiDate(item.end_date) }`;
        item["dataCreateDate"] = `${ this.getThaiDate(item.create_date) }`;
        return (
          (this.$refs.filter_status.selectedStatus === 'ทั้งหมด' || status_call === this.$refs.filter_status.selectedStatus) &&
          (startDate === null || itemDate >= startDate) &&
          (endDate === null || itemDate <= endDate)
        );
      });
    },
  },
  methods: {
    async applyFilter() {
      const datas = this.filteredItems
      this.dataExport = datas.map((data) => {
        return {
          'call_no'       : data.call_no,
          'create_date'   : `${this.getThaiDate(data.create_date)}`,
          'topic'         : data.topic,
          'name'          : `${data.name + ' ' + data.lastname}`,
          'division'      : data.division,
          'date'          : `${this.getThaiDate(data.start_date) +' ถึง ' + this.getThaiDate(data.end_date) }`,
          'status_call'   : `${ this.getstatus(data.status_call) }`,
          'admin_id'      : `${data.adminName + ' ' + data.adminLastname}`
        }
      })
    },

    async getReportComplain(){
      let path                = `/api/getComplain`
      let response            = await axios.get(`${path}`)
      this.items              = response.data
      this.loading = false
    },

    getThaiDate(item){
      if (item){
        var d = new Date(item);
        return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
      }else{
        return "";
      }
    },
    getstatus (status_call) {
      if (status_call == 0) return 'รอรับเรื่อง'
      else if (status_call == 1) return 'รับเรื่อง'
      else if (status_call == 2) return 'ไม่รับเรื่อง'
      else if (status_call == 3) return 'อยู่ระหว่างดำเนินการ'
      else if (status_call == 4) return 'สอบถามข้อมูลเพิ่มเติม'
      else if (status_call == 5) return 'เรื่องเสร็จ'
      else return ''
    },
    changeStartDate(date){
      this.getStartDate = date
    },
    changeEndDate(date){
      this.getEndDate = date
    }
  }
};
</script>
