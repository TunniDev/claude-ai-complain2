<template>
    <div class="page-main">
        <div class="head-topic">
            <v-container>
                <v-row>
                    <span class="head-left">หน้าหลัก</span>
                </v-row>
            </v-container>
        </div>
        <div class="section-main">
            <v-container>
            </v-container>
        </div>
    </div>
</template>

<script>
import axios  from 'axios'
import moment from 'moment'
export default {
  components: {},
    data: () => ({
        dialog: true,
        items: {},
        informationArray: [],
        policyArray: [],
        clickCount: 0,
        imageUrl: ''
    }),
    mounted(){
       // this.getPopupBanner()
       // this.getDataAnnounce()
    },

    methods: {
        getThaiDate(value){
        if (value){
            var d = new Date(value);
            return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
        }else{
            return "";
        }
        },
        getDate(value){
            return moment(value).format('DD')
        },
        getMonth(value){
            return moment(value).format('MMM')
        },

        async getPopupBanner(){
            let path                = `/api/user/get/popupBanner`
            let response            = await axios.get(`${path}`)

            if(response){
                let path = `/api/get/user/UrlFilesBanner?filename=${response.data.data[0].file_name}`
                let res = await axios.get(`${path}`)
                this.imageUrl = res.data
            }

            this.$refs.loader.overlay = false;
        },
    },
  }
</script>
<style scoped>
    .box-information{
        width: 580px;
        height: 230px;
    }
    .box-information,
    .box-policy{
        box-shadow: none!important;
        display: inline-block;
    }
    .box-date{
        margin: 16px;
        background: #bdbdbd;
        text-align: center;
        padding: 8px 0;
        width: 64px;
    }
    .box-date p{
        margin-bottom: 0;
    }
    .text-line{
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .popup-banner{
        max-width: 900px;
        height: auto;
    }
</style>
