/**
 * @file
 * @description 对axios的二次封装
 */
import axios from "axios"
import {Message} from "element-ui";
import store from "@/store";
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

axios.defaults.baseURL = process.env["VUE_APP_BASE_URL"]//配置基地址
axios.defaults.timeout = process.env["VUE_APP_TIMEOUT"]//配置超时时间

/**
 * 配置请求拦截器
 */
axios.interceptors.request.use(config => {
    //开启加载
    Nprogress.start()
    //TODO 配置请求头token
    config.headers.Authorization = store.getters.getToken

    return config
}, error => Promise.reject(error))
/**
 * 配置响应拦截器
 */

axios.interceptors.response.use(res => {

    const {data, meta: {msg, status}} = res.data
    Nprogress.done()
    if (status === 200 || status === 201) {
        return data
    } else {
        Message.error(msg)
        return Promise.reject(msg)
    }


}, error => {
    const msg = error.toString()
    if (msg.includes('Network Error')) {
        Message.error('网络错误，请检查您的网络配置！')
        return Promise.reject(error)
    }
    if (msg.includes('Timeout')) {
        Message.error('请求超时，请稍后再试！')
        return Promise.reject(error)
    }
    const {status} = error.response
    switch (status) {
        case 401:
            Message.error('请求超时，请稍后再试！')
            store.dispatch('exit')
            break;
        case 500:
            Message.error('服务器错误，请稍后再试！')
            break;
        case 404:
            Message.error('请求地址异常，请稍后再试！')
            break;
    }
    return Promise.reject(error)
})

export default axios;

