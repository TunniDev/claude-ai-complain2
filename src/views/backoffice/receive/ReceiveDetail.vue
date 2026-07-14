<template>
  <div class="receive-detail">
      <loaderView ref="loader"/>
      <BreadcrumbsView :items="item"/>
      <v-card>
        <DetailComplain ref="data" @updateValue="getValue" />
      </v-card>
      <v-btn class="btn-submit mt-3 mr-2" color="deep-orange" @click="dialogShowCancel">ไม่รับเรื่อง</v-btn>
      <v-btn class="btn-submit mt-3" @click="dialog = true">รับเรื่อง</v-btn>

      <!-- รับเรื่อง -->
      <v-dialog v-model="dialog" persistent max-width="500">
        <v-card class="dialog-receive">
          <v-form ref="form">
            <v-toolbar color="#167dc2" theme="dark">
              <v-toolbar-title>รับเรื่อง</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <div class="style-label px-0">รายละเอียดปัญหา/สาเหตุ</div>
              <v-textarea
                variant="outlined"
                name="input-7-4"
                hide-details="auto"
                v-model="complain_detail"
                :maxlength="maxLengthFiveHundredTwelve"
                @input="checkRulesLength(complain_detail.length, maxLengthFiveHundredTwelve)"
              ></v-textarea>
            </v-card-text>
            <v-card-actions class="px-4 pb-5">
                <v-spacer></v-spacer>
                <v-btn class="btn-submit" type="button" @click="saveComplainStep">บันทึก</v-btn>
                <v-btn class="btn-cancel" type="button" variant="text" @click="close">ยกเลิก</v-btn>
              </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>

      <!-- ไม่รับเรื่อง -->
      <v-dialog v-model="dialogCancel" persistent max-width="500">
        <v-card class="dialog-receive">
          <v-form ref="formCancel">
            <v-toolbar color="#167dc2" theme="dark">
              <v-toolbar-title>ไม่รับเรื่อง</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <p class="style-label">ข้อความตอบกลับผู้ใช้งาน</p>
              <v-textarea
                v-model="cancelMessageText"
                label="พิมพ์ข้อความตอบกลับผู้ใช้งาน"
                variant="outlined"
                rows="3"
                hide-details="auto"
                :maxlength="maxLengthFiveHundredTwelve"
                @input="checkRulesLength(cancelMessageText.length, maxLengthFiveHundredTwelve)"
              ></v-textarea>

              <p class="style-label mt-3">กรุณาติดต่อช่องทาง</p>
              <v-textarea
                v-model="contactChannelText"
                label="พิมพ์ช่องทางการติดต่อ"
                variant="outlined"
                rows="3"
                counter
                hide-details="auto"
                :maxlength="maxLengthThousand"
                @input="checkRulesLength(contactChannelText.length, maxLengthThousand)"
              ></v-textarea>

              <p v-if="savedCancel" class="saved-note mt-3">
                <i class="fa-solid fa-circle-check"></i> บันทึกแล้ว — กด SEND เพื่อส่ง หรือ ปิด เพื่อออก
              </p>
            </v-card-text>
            <v-card-actions class="px-4 pb-5">
                <v-spacer></v-spacer>
                <v-btn class="btn-submit" type="button" @click="saveComplainStep">บันทึก</v-btn>
                <v-btn class="btn-cancel" type="button" variant="text" @click="closeCancel">{{ savedCancel ? 'ปิด' : 'ยกเลิก' }}</v-btn>
                <v-btn class="btn-submit" type="button" variant="text" @click="sendFile">SEND</v-btn>
              </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
  </div>
</template>
<script>
import axios from "axios";
import Swal from 'sweetalert2';
import store from '../../../store/index.js';
import loaderView from '@/components/loaderView.vue';
import BreadcrumbsView from '@/components/breadcrumbsView.vue';
import DetailComplain from '@/components/detailComplain.vue';

  export default {
  components: {  BreadcrumbsView, DetailComplain, loaderView},
    data () {
      return {
        tab: null,
        dataComplain: {},
        dataRegister: {},
        files: {},
        complain_detail: '',
        cancel_complain_detail: '',
        dialog: false,
        dialogCancel: false,
        savedCancel: false,
        check_roles: store.getters.user,
        url: '',
        overlayImg: false,
        opacity: 1,
        absolute: false,
        loading: false,
        show: false,
        maxLengthFiveHundredTwelve: 512,
        maxLengthThousand: 1000,
        item: [
          {
            text: 'รับปัญหา',
            disabled: false,
            href: '/backoffice/receive',
          },
          {
            text: 'รายละเอียดปัญหา',
            disabled: true,
            href: 'breadcrumbs_link_1',
          },
        ],
        cancelMessageText: '',
        contactChannelText: '',
      }
    },

    methods: {
      dialogShowCancel(){
        this.dialogCancel = true;
        this.savedCancel = false;
      },
      close(){
        this.dialog = false
        this.complain_detail = ''
      },
      closeCancel(){
        this.dialogCancel = false
        this.cancelMessageText = ''
        this.contactChannelText = ''
        this.savedCancel = false
        if (this.$refs.formCancel) this.$refs.formCancel.resetValidation()
        if (this.$route.name === 'receive-detail') {
          this.$router.push({ name: 'backoffice-follow' })
        }
      },
      checkRulesLength(valueLength, maxLength){
          if(valueLength === maxLength){
              Swal.fire(`กรอกได้ไม่เกิน ${maxLength} ตัวอักษร`)
          }
      },
      async saveComplainStep(){
        try {
          console.log('saveComplainStep clicked, dialogCancel =', this.dialogCancel)
          const formRef = this.dialogCancel ? this.$refs.formCancel : this.$refs.form
          if (formRef) {
            const { valid } = await formRef.validate()
            if (!valid) return
          }

          let fd = {
            "complain_id"           : this.dataComplain.id,
            "admin_id"              : this.check_roles.id,
            "register_id"           : this.dataComplain.register_id,
            "register_email"        : this.dataRegister.email,
            "register_name"         : this.dataRegister.name,
            "detail"                : this.complain_detail,
            "status_call"           : this.dialogCancel ? 2 : 1,
            "status_name"           : this.dialogCancel ? 'ไม่รับเรื่อง' : 'รับเรื่อง',
            "cancel_message_id"     : null,
            "cancel_message_name"   : this.dialogCancel ? this.cancelMessageText : '',
            "cancel_contact_id"     : null,
            "cancel_contact_name"   : this.dialogCancel ? this.contactChannelText : '',
            "cancel_contact_url"    : '',
            "cancel_message_other"  : '',
            "create_by"             : this.check_roles.id,
            "modified_by"           : this.check_roles.id,
          }

          let path = `/api/backoffice/create/complainStep`
          await axios.post(`${path}`, fd)

          await Swal.fire({
              icon: 'success',
              title: 'บันทึกสำเร็จ',
              text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
          })

          if (this.dialogCancel) {
            this.savedCancel = true
          } else {
            this.dialog = false
            await this.$router.push({name:"backoffice-follow"});
          }

        } catch (error) {
          console.error('saveComplainStep error:', error)
          Swal.fire({
              icon: 'error',
              title: 'บันทึกไม่สำเร็จ',
              text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
          })
        }
      },
      async getValue(v) {
        this.dataComplain = v.data
        this.dataRegister = v.user
        setTimeout(() => (this.$refs.loader.overlay = false), 300);
      },

      async sendFile(){
        try {
          console.log('sendFile clicked')
          let fd = {
              "mail"           : "saraban@dbd.go.th",
          }
          let path  = `/api/backoffice/sendFile`
          await axios.post(`${path}`, fd)
          await Swal.fire({
              icon: 'success',
              title: 'ส่งสำเร็จ',
              text: 'ระบบได้ส่งข้อมูลเรียบร้อยแล้ว'
          })
        } catch (error) {
          console.error('sendFile error:', error)
          Swal.fire({
              icon: 'error',
              title: 'ส่งไม่สำเร็จ',
              text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
          })
        }
      },
    }
  }
</script>

<style>
  .input-gray .v-field{
      background: #ebe9e9!important;
  }
  .v-overlay.style-bg{
    z-index: 300!important;
  }
  .v-overlay.style-bg img{
    width: 500px;
    height: 500px;
    object-fit: contain;
  }
  .saved-note{
    color: #2e7d32;
    font-size: 14px;
  }
</style>
