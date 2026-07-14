<template>
    <div class="page-layout">
        <v-app-bar class="user-navbar" flat>
            <v-container>
                <v-row class="align-center">

                    <router-link to="/" class="header-logo" aria-label="หน้าหลัก">
                        <img
                            src="@/assets/images/logo-yellow.png"
                            alt="ตราสัญลักษณ์กรมบัญชีกลาง"
                        />
                    </router-link>

                    <v-spacer />
                    <div class="head-menu">

                        <v-tooltip location="bottom" color="#1976d2" text="หน้าหลัก">
                            <template v-slot:activator="{ props }">
                                <router-link class="mr-5" to="/" >
                                    <span v-bind="props">
                                        <i class="fa-solid fa-house"></i>
                                    </span>
                                </router-link>
                            </template>
                        </v-tooltip>

                        <v-tooltip location="bottom" color="#1976d2" text="รับเรื่องร้องเรียน">
                            <template v-slot:activator="{ props }">
                                <router-link class="mr-5" to="/user/RequestForm" >
                                    <span v-bind="props">
                                        <i class="fas fa-file-signature"></i>
                                    </span>
                                </router-link>
                            </template>
                        </v-tooltip>

                        <v-tooltip location="bottom" color="#1976d2" text="ติดต่อเรา">
                            <template v-slot:activator="{ props }">
                                <router-link class="mr-5" to="/user/contact" >
                                    <span v-bind="props">
                                        <i class="fa-solid fa-phone"></i>
                                    </span>
                                </router-link>
                            </template>
                        </v-tooltip>

                        <v-tooltip location="bottom" color="#1976d2" text="เข้าสู่ระบบ">
                            <template v-slot:activator="{ props }">
                                <router-link to="/user/login" >
                                    <span v-bind="props">
                                        <i class="fa-solid fa-right-to-bracket"></i>
                                    </span>
                                </router-link>
                            </template>
                        </v-tooltip>
                    </div>

                </v-row>
            </v-container>
        </v-app-bar>
        <v-main class="box-main">
            <router-view></router-view>
        </v-main>
        <v-footer class="footer-main">
            <v-container>
                <p>กรมบัญชีกลาง ถนนพระรามที่ 6 แขวงพญาไท เขตพญาไท กรุงเทพฯ 10400</p>
                <p>Call Center 0-2270-6400</p>
                <p>หมายเลขโทรศัพท์กลาง 0-2127-7000 </p>
            </v-container>
        </v-footer>
    </div>
</template>

<script>
  export default {
  components: { },
    data: () => ({}),
  }
</script>
<style scoped>
    .page-layout{
        height: 100%;
    }
    /* ใช้ชื่อ class เฉพาะ (user-navbar) กันชนกับ .navbar global ของ HomeView */
    .user-navbar {
        background-color: #ffffff!important;
        box-shadow: none!important;
    }
    .user-navbar :deep(.v-toolbar__content){
        height: 64px;
        background: #ffffff;
        border-bottom: none;
    }
    .header-logo {
        display: flex;
        width: 42px;
        height: 52px;
        flex: 0 0 42px;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background-color: transparent!important;
    }
    .header-logo img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    /* กัน global .router-link-exact-active { background:#003366 } ของ HomeView มาทับโลโก้ */
    .header-logo.router-link-exact-active {
        border-bottom: 0;
        background-color: transparent!important;
    }
    .box-main{
        height: 100%;
    }

    .head-menu a {
        text-decoration: none;
        background: transparent;
        color: #003366;
    }
    .head-menu a:hover {
        color: #fcc200;
    }
    /* เมนูที่ active: ขีดเส้นใต้เหลือง ไม่เอาพื้นน้ำเงินที่ leak มา */
    .head-menu a.router-link-exact-active,
    .router-link-exact-active{
        border-bottom: 2px solid ;
        color: #fcc200!important;
        background-color: transparent!important;
    }

    .footer-main{
        background: #003366!important;
        padding-bottom: 16px;
        padding-top: 16px;
    }
    .footer-main p {
        color: white;
        text-align: left;
    }
</style>
