<template>
  <div class="edit-profile">
    <LoaderView ref="loader"/>
    <div class="style-page">
      <v-form
        ref="form"
        v-model="valid"
      >
        <stepTwo ref="user" :datas="data" check_page="edit-profile"/>
        <v-btn class="btn-submit" @click="editProfile">บันทึก</v-btn>
      </v-form>
    </div>
  </div>
</template>

<script>
import axios  from "axios"
import Swal from 'sweetalert2'
import store from '../store/index.js'
import stepTwo from '@/components/step/stepTwo.vue'
import LoaderView from '@/components/loaderView.vue'

export default {
  components: { stepTwo, LoaderView },
  data: () => ({
    valid: true,
    check_roles: store.getters.user,
    data : []
  }),
  mounted(){
    this.getRegister()
  },
  methods:{
    async getRegister () {
        try {
            let path        = `/api/backoffice/get/registerDetail`
            let response    = await axios.get(`${path}/`+ this.check_roles.id )
            console.log(response);
            this.data       = response.data.data[0]
            setTimeout(() => (this.$refs.loader.overlay = false), 500);
        } catch (error) {
            console.log('error :' + error)
        }
    },
    async editProfile(){
      const { valid } = await this.$refs.form.validate()
      if (valid) {
          const user = this.$refs.user
          try {
            let fd = {
                "id"                    : user.item.id,
                "email"                 : user.item.email,
                "name"                  : user.item.name,
                "lastname"              : user.item.lastname,
                "gender"                : user.item.gender,
                "age"                   : user.item.age,
                "phone"                 : user.item.phone,
                "phone_other"           : user.item.phone_other,
                "address"               : user.item.address,
                "province_id"           : user.province !== null ? user.province.id || user.province : null,
                "province_name"         : user.province !== null ? user.province.value || user.item.province_name : null,
                "district_id"           : user.district !== null ? user.district.id || user.district : null,
                "district_name"         : user.district !== null ? user.district.value || user.item.district_name : null,
                "subdistrict_id"        : user.subdistrict !== null ? user.subdistrict.id || user.subdistrict : null,
                "subdistrict_name"      : user.subdistrict !== null ? user.subdistrict.value || user.item.subdistrict_name : null,
                "postcode"              : user.item.postcode,
            }
            console.log(fd);
                let path = `/api/user/edit/profile`
                let response = await axios.post(`${path}`, fd)
                console.log(response);

                await Swal.fire({
                  icon: 'success',
                  title: 'บันทึกสำเร็จ',
                  text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
                })
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'บันทึกไม่สำเร็จ',
              text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
            })
            console.log('edit_profile', error );
          }
      }
    }
  }
}
</script>

<style scoped>
.form-register{
    box-shadow: none!important;
}
.btn-submit{
    border: 1px solid #003366;
    background-color: #003366!important;
    color: white;
}
</style>
