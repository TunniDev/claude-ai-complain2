<template>
  <div class="register-form">
      <LoaderView ref="loader"/>
      <breadcrumbsView :items="item"/>
      <div class="style-page">
        <v-card class="style-card">
          <v-toolbar flat>
            <v-toolbar-title class="h2"> ข้อมูลผู้ร้อง / ข้อมูลติดต่อ </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col>
              <p class="style-label">Email :</p>
              <v-text-field v-model="data.email" density="compact" variant="outlined" readonly hide-details></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols md="4">
              <p class="style-label">ชื่อ :</p>
              <v-text-field v-model="data.name" density="compact" variant="outlined" readonly hide-details></v-text-field>
            </v-col>
            <v-col cols md="4">
                <p class="style-label">นามสกุล :</p>
              <v-text-field v-model="data.lastname" density="compact" variant="outlined" readonly hide-details></v-text-field>
            </v-col>
            <v-col cols md="4">
              <p class="style-label">อายุ (ปี) : </p>
              <v-text-field v-model="data.age" density="compact" variant="outlined" readonly hide-details></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols md="6">
              <p class="style-label">เบอร์โทรศัพท์มือถือ :</p>
              <v-text-field v-model="data.phone" density="compact" variant="outlined" readonly hide-details></v-text-field>
            </v-col>
            <v-col cols md="6">
                <p class="style-label">เบอร์ติดต่ออื่น ๆ :</p>
              <v-text-field v-model="data.phone_other" density="compact" variant="outlined" readonly hide-details></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <p class="style-label">ที่อยู่ :</p>
              <v-text-field v-model="data.address" density="compact" variant="outlined" readonly hide-details></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols md="3">
              <p class="style-label">จังหวัด</p>
              <v-text-field v-model="data.province_name" density="compact" variant="outlined" readonly hide-details></v-text-field>
            </v-col>
            <v-col cols md="3">
              <p class="style-label">เขต / อำเภอ</p>
              <v-text-field v-model="data.district_name" density="compact" variant="outlined" readonly hide-details></v-text-field>
            </v-col>
            <v-col cols md="3">
              <p class="style-label">แขวง / ตำบล</p>
              <v-text-field v-model="data.subdistrict_name" density="compact" variant="outlined" readonly hide-details></v-text-field>
            </v-col>
            <v-col cols md="3">
              <p class="style-label">รหัสไปรษณีย์</p>
              <v-text-field v-model="data.postcode" density="compact" variant="outlined" readonly hide-details></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        </v-card>
      </div>
  </div>
</template>

<script>
import  axios  from "axios"
import LoaderView from '@/components/loaderView.vue'
import breadcrumbsView from "@/components/breadcrumbsView.vue"
export default {
components: { LoaderView, breadcrumbsView },

data: () => ({
  valid: true,
  data : {},
  item: [
      { text: 'รายการผู้ร้องเรียน', disabled: false, href: '/backoffice/register' },
      { text: 'ข้อมูลผู้ร้อง / ข้อมูลติดต่อ', disabled: true, href: '/backoffice/register/form' },
  ],
}),
mounted(){
  this.getRegister()
},

methods: {
  async getRegister () {
      try {
          let path        = `/api/backoffice/get/registerDetail`
          let response    = await axios.get(`${path}/`+ this.$route.params.id )
          this.data       = response.data.data[0]
          this.loadTable = false;
          setTimeout(() => (this.$refs.loader.overlay = false), 300);
      } catch (error) {
          console.log('error :' + error)
      }
  },
}

}
</script>

<style>
</style>
