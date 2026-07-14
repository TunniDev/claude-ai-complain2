<template>
   <div class="user-detail">
    <loaderView ref="loader"/>
        <div class="style-page">
            <v-card class="style-card">
                <v-toolbar flat>
                    <v-toolbar-title class="h2">โปรไฟล์</v-toolbar-title>
                </v-toolbar>

                <v-card-text>
                    <v-row align="center">
                        <v-col cols="12">
                            <div class="style-subheader">รหัสผู้ใช้งาน</div>
                            <v-text-field
                                v-model="username"
                                variant="solo"
                                readonly
                                hide-details="auto"
                                class="input-gray"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row align="center">
                        <v-col cols="12" md="6">
                            <div class="style-subheader">ชื่อ</div>
                            <v-text-field
                                v-model="name"
                                variant="solo"
                                readonly
                                hide-details="auto"
                                class="input-gray"
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <div class="style-subheader">นามสกุล</div>
                            <v-text-field
                                v-model="lastname"
                                variant="solo"
                                readonly
                                hide-details="auto"
                                class="input-gray"
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row align="center">
                        <v-col cols="12" md="6">
                            <div class="style-subheader">ตำเเหน่ง</div>
                            <v-text-field
                                v-model="position"
                                variant="solo"
                                readonly
                                hide-details="auto"
                                class="input-gray"
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <div class="style-subheader">หน่วยงาน</div>
                            <v-text-field
                                v-model="divisions"
                                variant="solo"
                                readonly
                                hide-details="auto"
                                class="input-gray"
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" md="6">
                            <div class="style-subheader">ประเภทสิทธิ์การใช้งาน</div>
                            <v-text-field
                                v-model="roles"
                                variant="solo"
                                readonly
                                hide-details="auto"
                                class="input-gray"
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <div class="style-subheader">สถานะการใช้งาน</div>
                            <v-text-field
                                v-model="status"
                                variant="solo"
                                readonly
                                hide-details="auto"
                                class="input-gray"
                            ></v-text-field>
                        </v-col>
                    </v-row>

                </v-card-text>

            </v-card>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import loaderView from '@/components/loaderView.vue';
export default {
    components: { loaderView},
    data:() => ({
        username: '',
        name: '',
        lastname: '',
        position: '',
        roles: '',
        divisions: '',
        status: '',
    }),
    mounted(){
        this.getuserDetail()
    },
    methods: {
        async getuserDetail(){
            let path                    = `/api/backoffice/get/userDetail`
            let response                = await axios.get(`${path}/`+ this.$route.params.id)
            this.username               = response.data.data[0].username
            this.name                   = response.data.data[0].name
            this.lastname               = response.data.data[0].lastname
            this.position               = response.data.data[0].position
            this.divisions              = response.data.data[0].divisions === 1 ? 'ศทส' : 'กบค'
            this.roles                  = response.data.data[0].roles === 'general' ? 'เจ้าหน้าที่รับเรื่อง' : 'ผู้ดูเเลระบบ'
            this.status                 = response.data.data[0].status === 1 ?  'ใช้งาน' : 'ไม่ใช้งาน'

            setTimeout(() => (this.$refs.loader.overlay = false), 300);
        },
    }
}
</script>

<style scoped>
.style-subheader{
    text-align: left;
    font-size: 14px;
    color: rgba(0,0,0,.6);
    height: 32px;
    display: flex;
    align-items: center;
}
</style>
