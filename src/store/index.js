import Vue from 'vue'
import Vuex from 'vuex'
import router from "@/router";

Vue.use(Vuex)
/**
 *
 * @param store  vuex数据持久化
 */
const saveStoreData = (store) => {
    const key = 'VUE_STORE_KEY'
    const storage = window.sessionStorage
    const data = storage.getItem(key)
    data && store.replaceState(JSON.parse(data))

    store.subscribe((mutation, state) => {
        storage.setItem(key, JSON.stringify(state))
    })
}


export default new Vuex.Store({
    state: {
        userInfo: {},
        menus: []
    }, getters: {
        /**
         *
         * @param state
         * @return {CancelToken}获取token
         */
        getToken(state) {
            return state.userInfo.token
        }
    }, mutations: {
        /**
         * @param state
         * @param res 储存用户信息
         */
        setUserInfo(state, res) {
            state.userInfo = res
        },
        /**
         *
         * @param state
         * @param payload 清除用户信息
         */
        removeUserInfo(state, payload) {
            state.userInfo = payload
        },
        /**
         *
         * @param state
         * @param payload 保存菜单信息
         */
        saveMenus(state, payload) {
            state.menus = payload
        }
    }, actions: {
        exit({commit}) {
            commit('removeUserInfo', {})
            router.push({name: 'login'})
        }
    }, modules: {}, plugins: [saveStoreData]
})
