<template>
  <div class="user-view">
    <loaderView ref="loader"/>
    <div class="dashboard">
      <v-container class="bg-surface-variant">
        <h2 class="text-left mb-2">ภาพรวมโครงการ</h2>
        <v-row>
          <v-col cols="12" md="3">
            <v-sheet class="ma-2 pa-2">
              <div class="box-status">
                <h4>ทั้งหมด</h4>
                <p class="mb-1">{{ statusAllTotal ? statusAllTotal : 0 }} รายการ</p>
                <i aria-hidden="true" class="v-icon mdi mdi-clipboard-text"></i>
              </div>
            </v-sheet>
          </v-col>

          <v-col cols="12" md="3">
            <v-sheet class="ma-2 pa-2 border-gray">
              <div class="box-status">
                <h4>รอรับเรื่อง</h4>
                <p class="mb-1">{{statusWaitTotal ? statusWaitTotal : 0}} รายการ</p>
                <i aria-hidden="true" class="v-icon mdi mdi-jira"></i>
              </div>
            </v-sheet>
          </v-col>

          <v-col cols="12" md="3">
            <v-sheet class="ma-2 pa-2 border-yellow">
              <div class="box-status">
                <h4>รับเรื่อง</h4>
                <p class="mb-1">{{statusAcceptTotal ? statusAcceptTotal : 0}} รายการ</p>
                <i aria-hidden="true" class="v-icon mdi mdi-clipboard-check"></i>
              </div>
            </v-sheet>
          </v-col>

          <v-col cols="12" md="3">
            <v-sheet class="ma-2 pa-2 border-orange">
              <div class="box-status">
                <h4>ไม่รับเรื่อง</h4>
                <p class="mb-1">{{statusNotAcceptTotal ? statusNotAcceptTotal : 0}} รายการ</p>
                <i aria-hidden="true" class="v-icon mdi mdi-clipboard-remove"></i>
              </div>
            </v-sheet>
          </v-col>

          <v-col cols="12" md="3">
            <v-sheet class="ma-2 pa-2 border-blue">
              <div class="box-status">
                <h4>อยู่ระหว่างดำเนินการ</h4>
                <p class="mb-1">{{statusProcessTotal ? statusProcessTotal : 0}} รายการ</p>
                <i aria-hidden="true" class="v-icon mdi mdi-clipboard-clock"></i>
              </div>
            </v-sheet>
          </v-col>

          <v-col cols="12" md="3">
            <v-sheet class="ma-2 pa-2 border-purple">
              <div class="box-status">
                <h4>สอบถามข้อมูลเพิ่มเติม</h4>
                <p class="mb-1">{{statusAskForTotal ? statusAskForTotal : 0}} รายการ</p>
                <i aria-hidden="true" class="v-icon mdi mdi-clipboard-edit"></i>
              </div>
            </v-sheet>
          </v-col>

          <v-col cols="12" md="3">
            <v-sheet class="ma-2 pa-2 border-green">
              <div class="box-status">
                <h4>เรื่องเสร็จ</h4>
                <p class="mb-1">{{statusFinishTotal ? statusFinishTotal : 0}} รายการ</p>
                <i aria-hidden="true" class="v-icon mdi mdi-check-bold"></i>
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <div class="style-page">
      <h2 class="mb-3">รายงาน</h2>
      <div class="d-flex justify-space-between align-center mb-6">
        <span>รายงานสรุปเเจ้งเรื่องร้องเรียน</span>
        <v-btn color="secondary" icon size="x-small" @click="reportComplain">
          <i class="fa-solid fa-magnifying-glass"></i>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  import loaderView from '@/components/loaderView.vue';
  import axios from "axios";
  export default {
    components: { loaderView },
    data: () => ({
      selectedItem: 1,
      items: [
        { text: 'รอรับเรื่อง', icon: 'mdi-jira' },
        { text: 'รับเรื่อง', icon: 'mdi-jira' },
        { text: 'ไม่รับเรื่อง', icon: 'mdi-jira' },
        { text: 'อยู่ระหว่างดำเนินการ', icon: 'mdi-cog' },
        { text: 'สอบถามข้อมูลเพิ่มเติม', icon: 'mdi-flag' },
        { text: 'เรื่องเสร็จ', icon: 'mdi-check-bold' },
      ],
      datasCountComplain: {},
      statusAllTotal: null,
      statusWaitTotal: null,
      statusAcceptTotal: null,
      statusNotAcceptTotal: null,
      statusProcessTotal: null,
      statusAskForTotal: null,
      statusFinishTotal: null
    }),

    mounted() {
      this.getCountComplain()
    },

    methods:{
      reportComplain(){
        this.$router.push({ name: 'report-complain'})
      },

      getIcon (status_call) {
        if (status_call == 0) return '#a19d9d'
        else if (status_call == 1) return '#FFA000'
        else if (status_call == 2) return '#EF6C00'
        else if (status_call == 3) return '#01579B'
        else if (status_call == 4) return '#512DA8'
        else if (status_call == 5) return 'green'
        else return 'green'
      },

      getColor (status_call) {
        if (status_call == 0) return '#a19d9d'
        else if (status_call == 1) return '#FFA000'
        else if (status_call == 2) return '#EF6C00'
        else if (status_call == 3) return '#01579B'
        else if (status_call == 4) return '#512DA8'
        else if (status_call == 5) return 'green'
        else return 'green'
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

      async getCountComplain(){
        try {
          let path                  = `/api/getCountComplain`
          let response              = await axios.get(`${path}`)
          this.datasCountComplain   = response.data

          if(this.datasCountComplain.length){
            for (let i = 0; i < this.datasCountComplain.length; i++) {
              if(this.datasCountComplain[i].status_call == 0){
                this.statusWaitTotal = this.datasCountComplain[i].total
              }else if(this.datasCountComplain[i].status_call == 1){
                this.statusAcceptTotal = this.datasCountComplain[i].total
              }else if(this.datasCountComplain[i].status_call == 2){
                this.statusNotAcceptTotal = this.datasCountComplain[i].total
              }else if(this.datasCountComplain[i].status_call == 3){
                this.statusProcessTotal = this.datasCountComplain[i].total
              }else if(this.datasCountComplain[i].status_call == 4){
                this.statusAskForTotal = this.datasCountComplain[i].total
              }else if(this.datasCountComplain[i].status_call == 5){
                this.statusFinishTotal = this.datasCountComplain[i].total
              }
            }
            this.statusAllTotal = this.statusWaitTotal + this.statusAcceptTotal + this.statusNotAcceptTotal + this.statusProcessTotal + this.statusAskForTotal + this.statusFinishTotal
          }

          setTimeout(() => (this.$refs.loader.overlay = false), 300);

        } catch (error) {
          if (error.response?.status === 401) {
            this.$router.push('/backoffice/login');
          } else {
            console.log('getCountComplain');
          }
        }
      }
    }
  }
</script>

<style>
  .dashboard .card {
    background-color: #fff;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 33.33%;
  }
  .dashboard .v-sheet {
    border-radius: 5px;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
  }
  .box-status .v-icon{
    width: 30px;
    height: 30px;
    font-size: 18px!important;
    border-radius: 100%;
    background: #003366;
    color: white;
  }
  .border-gray{ border: 3px solid #a19d9d!important; }
  .border-yellow{ border: 3px solid #FFA000!important; }
  .border-orange{ border: 3px solid #EF6C00!important; }
  .border-blue{ border: 3px solid #01579B!important; }
  .border-purple{ border: 3px solid #512DA8!important; }
  .border-green{ border: 3px solid green!important; }
</style>
