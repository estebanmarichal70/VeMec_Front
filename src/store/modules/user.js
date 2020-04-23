import {getInfo} from '@/api/user'
import {getToken, setToken, removeToken} from '@/utils/auth'
import router, {resetRouter} from '@/router'
import vemecServices from "@/api/vemecServices";

const state = {
  token: getToken(),
  access_token: null
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_JWT_TOKEN(state, payload) {
    state.access_token = payload;
    localStorage.setItem("access_token", JSON.stringify(payload));
  }
}

const actions = {
  // user login
  async login({commit}, userInfo) {
    const {username, password} = userInfo

    await vemecServices.services.login(userInfo)
      .then(response => {
      const {data} = response;
      commit('SET_JWT_TOKEN', data.token);
    })
      .catch(error => console.log("error al loguearse"));
  },

  // user logout
  logout({commit, dispatch}) {
        commit('SET_TOKEN', '')
        commit('SET_JWT_TOKEN', '')
        removeToken()
        resetRouter()
        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, {root: true})
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
