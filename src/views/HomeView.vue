<template>
  <v-app id="inspire">
    <v-navigation-drawer
      class="sidebar"
      v-model="drawer"
    >
      <div class="pa-3 d-flex align-center head-menuhome">
        <div class="logo-cgd mr-2">
          <img src="@/assets/images/logo-yellow.png" alt="logo"/>
        </div>
        <div class="text-head">
          รับเรื่องร้องเรียนทุจริต
        </div>
      </div>

      <v-list class="mt-5" density="compact" nav>
        <router-link
          v-if="!$route.path.includes('backoffice') && (check_roles.roles.includes('user') || check_roles.roles.includes('cgd'))"
          class="d-flex align-center menu-link pa-3"
          active-class="activemenu"
          :to="$route.path.includes('cgd') ? {path : '/cgd/follow'} : {path : '/user/follow'}"
        >
          <i class="fa-solid fa-eye menu-icon"></i>
          <span class="menu-text">ติดตามเรื่องร้องเรียน</span>
        </router-link>

        <router-link
          v-if="!$route.path.includes('backoffice') && (check_roles.roles.includes('user') || check_roles.roles.includes('cgd'))"
          class="d-flex align-center menu-link pa-3"
          active-class="activemenu"
          :to="$route.path.includes('cgd') ? {path :'/cgd/report'} : {path : '/user/report'}"
        >
          <i class="fa-solid fa-comment menu-icon"></i>
          <span class="menu-text">เเจ้งเรื่องร้องเรียนทุจริต</span>
        </router-link>

        <router-link
          v-if="$route.path.includes('backoffice') && (check_roles.roles.includes('admin') || check_roles.roles.includes('general'))"
          class="d-flex align-center menu-link pa-3"
          active-class="activemenu"
          to="/backoffice/receive"
        >
          <i class="fa-solid fa-magnifying-glass menu-icon"></i>
          <span class="menu-text">รับเรื่องร้องเรียนทุจริต</span>
        </router-link>

        <router-link
          v-if="$route.path.includes('backoffice') && (check_roles.roles.includes('admin') || check_roles.roles.includes('general'))"
          class="d-flex align-center menu-link pa-3"
          active-class="activemenu"
          to="/backoffice/follow"
        >
          <i class="fa-solid fa-eye menu-icon"></i>
          <span class="menu-text">รายการที่ต้องดำเนินการ</span>
        </router-link>

        <router-link
          v-if="$route.path.includes('backoffice') && check_roles.roles.includes('admin')"
          class="d-flex align-center menu-link pa-3"
          active-class="activemenu"
          to="/backoffice/personnel"
        >
          <i class="fas fa-users menu-icon"></i>
          <span class="menu-text">รายการบุคลากร</span>
        </router-link>

        <router-link
          v-if="$route.path.includes('backoffice') && check_roles.roles.includes('admin')"
          class="d-flex align-center menu-link pa-3"
          active-class="activemenu"
          to="/backoffice/register"
        >
          <i class="fa-solid fa-user menu-icon"></i>
          <span class="menu-text">รายการผู้ร้องเรียน</span>
        </router-link>

        <router-link
          v-if="$route.path.includes('backoffice') && check_roles.roles.includes('admin') && check_roles.id === 1"
          class="d-flex align-center menu-link pa-3"
          active-class="activemenu"
          to="/backoffice/report"
        >
          <i class="fa-solid fa-file-export menu-icon"></i>
          <span class="menu-text">รายงาน</span>
        </router-link>

        <router-link
          v-if="$route.path.includes('backoffice') && check_roles.roles.includes('admin') && check_roles.id === 1"
          class="d-flex align-center menu-link pa-3"
          active-class="activemenu"
          to="/backoffice/manage"
        >
          <i class="fa-solid fa-gear menu-icon"></i>
          <span class="menu-text">ตั้งค่า</span>
        </router-link>

      </v-list>
    </v-navigation-drawer>

      <v-app-bar class="navbar">
        <div class="style-navbar">
        <v-app-bar-nav-icon class="navbar-icon" @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>

        <span class="mr-2 color-primary">{{!$route.path.includes('user')? check_roles.username :check_roles.name + ' ' + check_roles.lastname }}</span>

        <v-menu>
          <template v-slot:activator="{ props }">
            <div
              class="box-user mr-2"
              v-bind="props"
            >
              <i class="fa-solid fa-circle-user f-24"></i>
            </div>
          </template>

          <v-list>
            <v-list-item v-if="check_roles.roles.includes('user')">
              <v-btn variant="text" rounded @click="editProfile"> โปรไฟล์ </v-btn>
              <v-divider class="my-3"></v-divider>
            </v-list-item>

            <v-list-item v-if="check_roles.roles.includes('user')">
              <v-btn variant="text" rounded @click="opensumone()">
                เปลี่ยนรหัสผ่าน
              </v-btn>
              <v-divider class="my-3"></v-divider>
            </v-list-item>

            <v-list-item v-if="check_roles.roles.includes('admin') && $route.path.includes('cgd')">
              <v-btn variant="text" rounded @click="$router.push('/backoffice/receive')">
                เมนูผู้ดูแลระบบ
              </v-btn>
              <v-divider class="my-3"></v-divider>
            </v-list-item>

            <v-list-item>
              <v-btn variant="text" rounded @click="logout"> <i class="fa-solid fa-arrow-right-from-bracket mr-1"></i> ออกจากระบบ </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>

        <DialogsResetPassword ref="sum" :userId="check_roles.id" />
      </div>
      </v-app-bar>
    <v-main class="main">
      <v-container>
          <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import DialogsResetPassword from '@/components/dialogsResetPassword.vue';
import store from '../store/index.js';
  export default {
    name: "MyHome",
    components: { DialogsResetPassword},
    data: () => ({
        dialog: false,
        drawer: true,
        check_roles: store.getters.user,
    }),
    methods: {
      opensumone () {
        this.$refs.sum.open()
      },
      homeUser(){
        this.$router.push("/user/login");
      },

      async editProfile(){
        if(this.check_roles.roles.includes('user')){
          await this.$router.push("/user/profile").catch(()=>{});
        }else{
          this.$router.push({ name: 'personal_detail',  params: { id: this.check_roles.id}})
        }
      },
      async logout() {
          await this.$store.dispatch("logout");
          if (this.$route.path.includes("cgd")){
              await this.$router.push({name:"cgd_login"});
          }else if (this.$route.path.includes("user")){
              await this.$router.push("/user/login");
          }else if (this.$route.path.includes("backoffice")){
              await this.$router.push("/backoffice/login");
          }
      }
    },
}
</script>
<style>
  .v-application{
    font-family: 'Prompt', sans-serif!important;
  }
  .sidebar{
    background-color: #167dc2!important;
    padding: 0;
  }
  .head-menuhome{
    flex-wrap: inherit!important;
    width: 100%;
  }
  .text-head{
    color: white;
    font-size: 17px!important;
  }
  .logo-cgd{
    max-width: 48px;
    height: 48px;
  }
  .logo-cgd img{
    width: 100%;
  }
  .navbar{
    background-color: #167dc2!important;
    color: white!important;
  }
  .navbar-icon{
    color: white!important;
  }

  .style-navbar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
  .main{
    background-color: #eef0f8;
  }
  .activemenu,
  .router-link-exact-active{
    background-color: #003366;
  }
  .activemenu:hover,
  .router-link-exact-active:hover{
    background-color: #003366;
  }
  .activemenu .menu-icon,
  .activemenu .menu-text{
    color: white!important;
  }
  .menu-link:hover{
    background-color: #003366;
  }
  .menu-link{
      text-decoration: none;
      border-radius: 4px;
      margin-bottom: 0.5rem;
  }
  .menu-icon {
    width: 20px;
    margin-right: 1rem;
    font-size: 18px;
    color: white;
  }
  .menu-text {
    color: white;
    font-size: 14px!important;
    text-align: left;
    line-height: inherit!important;
    font-weight: 300!important;
  }
  .style-page{
    padding: 1.5rem;
    background-color: white;
    border-radius: 15px;
  }
  .style-label{
    text-align: left;
    margin-bottom: 2px!important;
    font-size: 14px;
  }
  .style-label span{
    color: red;
    font-size: 16px;
  }
  .h2{
       text-align: left;
    font-size: 20px;
    font-weight: bold;
  }
  .error_message{
    text-align: left;
    font-size: 12px;
    color: #ff5252;
    margin-top: 4px;
  }
  .btn-cancel{
    border: 1px solid #003366;
    color: #003366;
  }
  .btn-submit{
      border: 1px solid #003366;
      background-color: #003366!important;
      color: white!important;
  }
  .f-24 {
    font-size: 24px;
    cursor: pointer;
  }
  .f-16{
    font-size: 14px;
  }
</style>
