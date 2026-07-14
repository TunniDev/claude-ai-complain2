import { createRouter, createWebHistory } from 'vue-router'
import store from '../store/index.js'

// user
import LayoutView from '../views/users/LayoutView.vue'
import MainView from '../views/users/main/MainView.vue'
import MainDetail from '../views/users/main/MainDetail.vue'
import RequestFormView from '../views/users/main/RequestFormView.vue'
import ContactView from '../views/users/contact/ContactView.vue'
import UserLoginView from '../views/users/LoginView.vue'
import FollowView from '../views/users/follow/FollowView.vue'
import FollowDetail from '../views/users/follow/FollowDetail.vue'
import ComplainView from '../views/users/complain/ComplainView.vue'
import EditProfile from '../views/EditProfile.vue'
import ForgotPasswordView from '../views/users/ForgotPassword.vue'
import ResetPasswordView from '../views/users/ResetPassword.vue'

// CGD (ใช้ component ร่วมกับฝั่ง user)
import CgdFollow from '../views/users/follow/FollowView.vue'
import CgdFollowDetail from '../views/users/follow/FollowDetail.vue'
import CgdComplain from '../views/users/complain/ComplainView.vue'

// backoffice
import LoginView from '../views/backoffice/LoginView.vue'
import ReceiveComplain from '../views/backoffice/receive/ReceiveView.vue'
import ReceiveDetail from '../views/backoffice/receive/ReceiveDetail.vue'
import BackofficeFollowView from '../views/backoffice/follow/FollowView.vue'
import BackofficeFollowDetail from '../views/backoffice/follow/FollowDetail.vue'
import PersonnelView from '../views/backoffice/personnel/UserViews.vue'
import PersonnelForm from '../views/backoffice/personnel/UserForm.vue'
import PersonnelFormEdit from '../views/backoffice/personnel/UserForm.vue'
import PersonalDetail from '../views/backoffice/personnel/UserDetail.vue'
import RegisterComplain from '../views/backoffice/register/RegisterViews.vue'
import Registerform from '../views/backoffice/register/RegisterForm.vue'
import ReportView from '../views/backoffice/report/ReportView.vue'
import ReportComplain from '../views/backoffice/report/reportComplain.vue'
import ManageView from '../views/backoffice/manage/manageView.vue'
import ReplyMessage from '../views/backoffice/manage/replyMessage.vue'
import ContactChannels from '../views/backoffice/manage/contactChannels.vue'
import AnnounceView from '../views/backoffice/manage/announceView.vue'
import BannersView from '../views/backoffice/manage/bannersView.vue'

import HomeView from '../views/HomeView.vue'
import HomeUserView from '../views/HomeView.vue'
import PageNotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    component: LayoutView,
    children: [
      { path: '/', name: 'main', component: MainView },
      { path: '/user/MainDetail/:id', name: 'main-detail', component: MainDetail },
      { path: '/user/RequestForm', name: 'RequestForm', component: RequestFormView },
      { path: '/user/contact', name: 'contact', component: ContactView },
      { path: '/user/login', name: 'userLogin', component: UserLoginView },
    ],
  },

  { path: '/user/forgot-password', name: 'forgot-password', component: ForgotPasswordView },
  { path: '/user/reset-password/:token', name: 'reset-password', component: ResetPasswordView },

  { path: '/backoffice/login', name: 'login', component: LoginView },

  {
    path: '/',
    component: HomeView,
    beforeEnter(to, from, next) {
      store.dispatch('checkLogin')
      if (
        store.state.user &&
        (store.state.user.roles.includes('admin') || store.state.user.roles.includes('general'))
      ) {
        next()
      } else {
        next({ name: 'login' })
      }
    },
    children: [
      { path: '/backoffice/receive', name: 'receive', component: ReceiveComplain },
      { path: '/backoffice/receive/detail/:id', name: 'receive-detail', component: ReceiveDetail },
      { path: '/backoffice/follow', name: 'backoffice-follow', component: BackofficeFollowView },
      { path: '/backoffice/follow/detail/:id', name: 'backoffice-complaindetail', component: BackofficeFollowDetail },
      { path: '/backoffice/personnel', name: 'personnel', component: PersonnelView },
      { path: '/backoffice/personnel/form', name: 'personnel_form', component: PersonnelForm },
      { path: '/backoffice/personnel/form/:id', name: 'personnel_formedit', component: PersonnelFormEdit },
      { path: '/backoffice/personal/detail/:id', name: 'personal_detail', component: PersonalDetail },
      { path: '/backoffice/register', name: 'register_complain', component: RegisterComplain },
      { path: '/backoffice/register/form/:id', name: 'register_form', component: Registerform },
      { path: '/backoffice/report', name: 'report_view', component: ReportView },
      { path: '/backoffice/report/1', name: 'report-complain', component: ReportComplain },
      { path: '/backoffice/manage', name: 'manage-view', component: ManageView },
      { path: '/backoffice/manage/replyMessage', name: 'reply-message', component: ReplyMessage },
      { path: '/backoffice/manage/contactChannels', name: 'contact-channels', component: ContactChannels },
      { path: '/backoffice/manage/announceView', name: 'announce-view', component: AnnounceView },
      { path: '/backoffice/manage/bannersView', name: 'banners-view', component: BannersView },
    ],
  },

  {
    path: '/',
    component: HomeUserView,
    beforeEnter(to, from, next) {
      store.dispatch('checkLogin')
      if (store.state.user && store.state.user.roles.includes('user')) {
        next()
      } else {
        next({ name: 'userLogin' })
      }
    },
    children: [
      { path: '/user/profile', name: 'profile', component: EditProfile },
      { path: '/user/follow', name: 'complain-follow', component: FollowView },
      { path: '/user/follow/detail/:id', name: 'complain-detail', component: FollowDetail },
      { path: '/user/report', name: 'complain-report', component: ComplainView },
    ],
  },

  {
    path: '/cgd',
    component: HomeUserView,
    beforeEnter(to, from, next) {
      store.dispatch('checkLogin')
      if (store.state.user && store.state.user.roles.includes('cgd')) {
        next()
      } else {
        next({ name: 'cgd_login' })
      }
    },
    children: [
      { path: '', redirect: '/cgd/follow' },
      { path: 'follow', name: 'cgd_follow', component: CgdFollow },
      { path: 'follow/:id', name: 'cgd_follow_detail', component: CgdFollowDetail },
      { path: 'report', name: 'cgd-complain', component: CgdComplain },
    ],
  },

  { path: '/cgd/login', name: 'cgd_login', component: LoginView },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: PageNotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
