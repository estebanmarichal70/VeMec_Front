import {getToken, removeToken} from '@/utils/auth'
import {resetRouter} from '@/router'
import vemecServices from "@/api/vemecServices";

const state = {
  token: getToken(),
  access_token: null,
  loginError: false
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_JWT_TOKEN(state, payload) {
    state.access_token = payload;
    localStorage.setItem("access_token", JSON.stringify(payload));
  },
  SET_LOGIN_ERROR(state, payload) {
    state.loginError = payload;
  }
}

const actions = {

  login({commit}, userInfo) {

    commit('SET_LOGIN_ERROR', null)
    //const {username, password} = userInfo
    return vemecServices.services.login(userInfo)
      .then(response => {
        const {data} = response;
        commit('SET_JWT_TOKEN', data.token);
        commit('SET_LOGIN_ERROR', false)
      })
      .catch(error => {
        commit('SET_LOGIN_ERROR', true);
      });
  },

  // user logout
  logout({commit, dispatch}) {
    commit('SET_TOKEN', '')
    commit('SET_JWT_TOKEN', null)
    removeToken();
    resetRouter();
    dispatch('tagsView/delAllViews', null, {root: true})
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
