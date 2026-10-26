import { createStore } from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'

const getDefaultState = () => ({
  user: null,
})

export default createStore({
  // persist เฉพาะ user (พฤติกรรมเดิมจาก vuex-persist)
  plugins: [createPersistedState({ paths: ['user'] })],

  state: getDefaultState(),

  getters: {
    user: (state) => state.user,
  },

  mutations: {
    authUser(state, data) {
      state.user = data
    },
    clearAuthUser(state) {
      state.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('expirationDate')
    },
  },

  actions: {
    async login({ commit }, authData) {
      const path = '/api/backoffice/login'
      const response = await axios.post(path, {
        username: authData.username,
        password: authData.password,
        userType: authData.userType,
      })
      const expirationTime = 1000 * 60 * 60 // 1 hour
      const now = Date.now()
      commit('authUser', response.data.userdata)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('expirationDate', now + expirationTime)
    },

    async userLogin({ commit }, authData) {
      const path = '/api/user/login'
      const response = await axios.post(path, {
        email: authData.email,
        password: authData.password,
        userType: authData.userType,
      })
      const expirationTime = 1000 * 60 * 60 // 1 hour
      const now = Date.now()
      commit('authUser', response.data.userdata)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('expirationDate', now + expirationTime)
    },

    async logout({ commit }) {
      const path = '/api/logout'
      try {
        await axios.post(path)
      } finally {
        commit('clearAuthUser')
      }
    },

    checkLogin({ commit }) {
      const expiration = localStorage.getItem('expirationDate')
      if (expiration < Date.now()) {
        commit('clearAuthUser')
      }
    },
  },

  modules: {},
})
