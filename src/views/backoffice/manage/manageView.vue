<template>
    <div class="manage-view">
        <v-row>
            <v-col md="3">
                <div class="box-card">
                    <i class="fa-solid fa-message"></i>
                    <router-link to="/backoffice/manage/replyMessage"><p>ข้อความตอบกลับผู้ใช้งาน</p></router-link>
                </div>
            </v-col>
            <v-col md="3">
                <div class="box-card">
                    <i class="fa-solid fa-address-book"></i>
                    <router-link to="/backoffice/manage/contactChannels"><p>ช่องทางการติดต่อ</p></router-link>
                </div>
            </v-col>
            <v-col md="3">
                <div class="box-card">
                    <i class="fa-solid fa-address-book"></i>
                    <router-link to="/backoffice/manage/announceView"><p>ช่องทางการประกาศ</p></router-link>
                </div>
            </v-col>
            <v-col md="3">
                <div class="box-card">
                    <i class="fa-solid fa-address-book"></i>
                    <router-link to="/backoffice/manage/bannersView"><p>ช่างทางการสร้างแบนเนอร์</p></router-link>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {}
</script>

<style>
    .box-card {
        background-color: #fff;
        padding: 20px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
</style>
