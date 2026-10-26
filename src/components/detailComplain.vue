<template>
    <div>
        <v-tabs
          v-model="tab"
          bg-color="#003366"
          class="style-tabs"
          centered
          theme="dark"
          >
            <v-tab value="tab-1">
                รายละเอียดปัญหา
                <i class="fa-solid fa-comment ml-1"></i>
            </v-tab>
            <v-tab value="tab-2" v-if="data.complain_type == 'user'">
                รายละเอียดผู้เเจ้งปัญหา
                <i class="fa-solid fa-user ml-1"></i>
            </v-tab>
        </v-tabs>

        <v-window v-model="tab">
            <v-window-item value="tab-1">
                <v-card flat>
                    <v-card-text>
                        <v-container fluid>
                            <div class="h2 mb-6">เจ้าหน้าที่ / หน่วยงาน</div>
                            <v-row class="align-center">
                                <v-col cols="2"><div class="style-subheader">ชื่อ</div></v-col>
                                <v-col cols="4">
                                    <v-text-field v-model="data.name" variant="solo" readonly hide-details="auto" class="input-gray"></v-text-field>
                                </v-col>
                                <v-col cols="2"><div class="style-subheader">นามสกุล</div></v-col>
                                <v-col cols="4">
                                    <v-text-field v-model="data.lastname" variant="solo" readonly hide-details="auto" class="input-gray"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row class="align-center">
                                <v-col cols="2"><div class="style-subheader">หน่วยงาน</div></v-col>
                                <v-col cols="4">
                                    <v-text-field v-model="data.division" variant="solo" readonly hide-details="auto" class="input-gray"></v-text-field>
                                </v-col>
                                <v-col cols="2"><div class="style-subheader">รูปพรรณสันฐาน</div></v-col>
                                <v-col cols="4">
                                    <v-text-field v-model="data.description_face" variant="solo" readonly hide-details="auto" class="input-gray"></v-text-field>
                                </v-col>
                            </v-row>

                            <div class="h2 mt-10 mb-6">เรื่องร้องเรียน</div>
                            <v-row class="align-center">
                                <v-col cols="2"><div class="style-subheader">Call No.</div></v-col>
                                <v-col cols="4">
                                    <v-text-field v-model="data.call_no" variant="solo" readonly hide-details="auto" class="input-gray"></v-text-field>
                                </v-col>
                                <v-col cols="2"><div class="style-subheader">วันที่บันทึกปัญหา</div></v-col>
                                <v-col cols="4">
                                    <v-text-field v-model="data.create_date" variant="solo" readonly hide-details="auto" class="input-gray"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row class="align-center">
                                <v-col cols="2"><div class="style-subheader">หัวเรื่อง</div></v-col>
                                <v-col cols="10">
                                    <v-text-field v-model="data.topic" variant="solo" readonly hide-details="auto" class="input-gray"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row class="align-center">
                                <v-col cols="2"><div class="style-subheader">สถานที่เกิดเหตุ</div></v-col>
                                <v-col cols="10">
                                    <v-text-field v-model="data.location" variant="solo" readonly hide-details="auto" class="input-gray"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row class="align-center">
                                <v-col cols="2"><div class="style-subheader">ช่วงวันเกิดเหตุ </div></v-col>
                                <v-col cols="4">
                                    <v-text-field v-model="data.start_date" label="วันที่เริ่มต้น" append-inner-icon="mdi-calendar" class="input-gray" readonly variant="solo" hide-details="auto"></v-text-field>
                                </v-col>
                                <v-col cols="2"><div class="style-subheader">ถึง </div></v-col>
                                <v-col cols="4">
                                    <v-text-field v-model="data.end_date" label="วันที่สิ้นสุด" append-inner-icon="mdi-calendar" readonly class="input-gray" variant="solo" hide-details="auto"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row class="align-center">
                                <v-col cols="2"><div class="style-subheader">ช่วงเวลาเกิดเหตุ </div></v-col>
                                <v-col cols="4">
                                    <v-text-field v-model="data.start_time" append-inner-icon="mdi-clock-time-four-outline" class="input-gray" readonly variant="solo" hide-details="auto"></v-text-field>
                                </v-col>
                                <v-col cols="2"><div class="style-subheader">ถึง </div></v-col>
                                <v-col cols="4">
                                    <v-text-field v-model="data.end_time" append-inner-icon="mdi-clock-time-four-outline" class="input-gray" readonly variant="solo" hide-details="auto"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row class="align-center">
                                <v-col cols="2"><div class="style-subheader">รายละเอียดเรื่องร้องเรียน</div></v-col>
                                <v-col cols="10">
                                    <v-textarea v-model="data.detail" variant="solo" readonly hide-details="auto" class="input-gray"></v-textarea>
                                </v-col>
                            </v-row>

                            <div class="h2 mt-10 mb-4">เอกสารประกอบการร้องเรียน</div>
                            <v-row class="align-center">
                                <v-col cols="12">
                                    <v-list>
                                    <div class="d-flex justify-space-between">
                                        <div class="style-subheader">ชื่อไฟล์</div>
                                        <div class="style-subheader">ไฟล์เเนบ</div>
                                    </div>
                                    <v-list-item
                                        v-for="file in files"
                                        :key="file.id"
                                    >
                                        <div class="d-flex justify-space-between align-center text-left" style="width:100%">
                                          <div>{{ file.file_original }}</div>
                                          <div class="btn-files" v-if="file.file_type == 'application/pdf'" @click="urlPdfFiles('UrlFilesComplain',file.file_name)"><i class="fa-solid fa-file"></i></div>
                                          <div class="btn-files" v-else @click="urlFiles('UrlFilesComplain',file.file_name)"><i class="fa-solid fa-image"></i></div>
                                        </div>
                                    </v-list-item>
                                    </v-list>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-window-item>
            <v-window-item value="tab-2" v-if="data.complain_type == 'user'">
                <v-card flat>
                    <v-card-text>
                        <v-container fluid>
                            <v-row>
                                <v-col class="d-flex">
                                    <div class="style-subheader mr-2">Email :</div>
                                    <v-text-field v-model="user.email" variant="solo" readonly hide-details="auto" class="input-gray"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols md="9" class="d-flex">
                                    <div class="style-subheader mr-2">ชื่อผู้แจ้งปัญหา</div>
                                    <v-text-field v-model="user.name" variant="solo" readonly hide-details="auto" class="input-gray"></v-text-field>
                                </v-col>
                                <v-col cols md="3" class="d-flex">
                                    <div class="style-subheader mr-2">อายุ</div>
                                    <v-text-field v-model="user.age" variant="solo" readonly hide-details="auto" class="input-gray"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols md="6" class="d-flex">
                                    <div class="style-subheader mr-2">*เบอร์โทรศัพท์มือถือ</div>
                                    <v-text-field v-model="user.phone" variant="solo" readonly hide-details="auto" class="input-gray"></v-text-field>
                                </v-col>
                                <v-col cols md="6" class="d-flex">
                                    <div class="style-subheader mr-2">เบอร์ติดต่ออื่น ๆ </div>
                                    <v-text-field v-model="user.phone_other" variant="solo" readonly hide-details="auto" class="input-gray"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="d-flex">
                                    <div class="style-subheader mr-2">ที่อยู่ :</div>
                                    <v-text-field v-model="user.address" variant="solo" readonly hide-details="auto" class="input-gray"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                </v-card-text>
            </v-card>
            </v-window-item>
        </v-window>

        <!-- โชว์รูป Complain -->
        <v-overlay v-model="overlayImg" class="style-bg align-center justify-center" :contained="absolute">
            <img :src="url" />
            <v-btn
                class="btn-overlay"
                icon
                @click="overlayImg = false"
            >
            <v-icon icon="fa-solid fa-xmark" color="white" />
            </v-btn>
        </v-overlay>
    </div>
</template>

<script>
import axios from "axios";
import moment  from 'moment-timezone';
export default {
    data: () => ({
        tab: null,
        data: {},
        user: {},
        files: {},
        url: '',
        overlayImg: false,
        opacity: 1,
        absolute: false,
    }),
    watch:{
    },
    mounted(){
        this.getComplainDetail()
    },
    methods: {
        async getComplainDetail(){
            let path              = `/api/user/get/complainDetail`
            let response          =  await axios.get(`${path}`,{
                params: {
                    id: this.$route.params.id,
                    userType: this.$route.path.includes('cgd') ? 'cgd' : this.$route.path.includes('backoffice') ?'admin' : 'user'
                }
            })
            this.data             = response.data.data[0]
            this.data.create_date = moment(response.data.data[0].create_date).add(543, 'year').tz("Asia/Bangkok").locale('th').format('DD MMMM YYYY')
            this.data.start_time  = moment(response.data.data[0].start_date).utcOffset("+00:00").format('HH:mm') == '00:00' ? '' : moment(response.data.data[0].start_date).utcOffset("+00:00").format('HH:mm')
            this.data.end_time  = moment(response.data.data[0].end_date).utcOffset("+00:00").format('HH:mm') == '00:00' ? '' : moment(response.data.data[0].end_date).utcOffset("+00:00").format('HH:mm')
            this.data.start_date  = moment(response.data.data[0].start_date).add(543, 'year').tz("Asia/Bangkok").locale('th').format('DD MMMM YYYY')
            this.data.end_date    = moment(response.data.data[0].end_date).add(543, 'year').tz("Asia/Bangkok").locale('th').format('DD MMMM YYYY')
            this.files            = response.data.data_files

            if (this.data.complain_type == 'user'){
                await this.getRegisterDetail()
            }
            this.updateValue()
        },
        async getRegisterDetail(){
            let path                =   `/api/backoffice/get/registerDetail`
            let response            =   await axios.get(`${path}/` + this.data.register_id)
            this.user               =   response.data.data[0]
            this.user.name          =   response.data.data[0].name + ' ' + response.data.data[0].lastname
            this.user.address       =   response.data.data[0].address + ' ' + response.data.data[0].subdistrict_name + ' ' + response.data.data[0].district_name + ' ' + response.data.data[0].province_name + ' ' + response.data.data[0].postcode
            console.log( this.user);
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

                    fileLink.click();
                    document.body.removeChild(fileLink);
                    window.URL.revokeObjectURL(fileURL);
            });
        },
        async urlFiles(url,file_name){
            let path = `/api/get/${url}?filename=${encodeURIComponent(file_name)}`
            let res = await axios.get(`${path}`, { responseType: 'blob' })
            const ext = (file_name.split('.').pop() || '').toLowerCase()
            const mimeByExt = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif' }
            const blob = mimeByExt[ext] ? res.data.slice(0, res.data.size, mimeByExt[ext]) : res.data
            this.url = window.URL.createObjectURL(blob)
            this.overlayImg = !this.overlayImg
        },
        updateValue() {
            this.$emit('updateValue', {
                data: this.data,
                user: this.user,
            });
        }
    }
}
</script>

<style>
    .input-gray .v-field{
        background: #ebe9e9!important;
    }
    .btn-files{
        cursor: pointer;
    }
    .style-subheader{
        text-align: left;
        font-size: 14px;
        color: rgba(0,0,0,.6);
        height: 40px;
        display: flex;
        align-items: center;
    }
</style>
