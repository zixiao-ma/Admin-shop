import axios from 'axios';
import { Message } from 'element-ui';

axios.defaults.baseURL = 'http://shiyansong.cn:8888/api/private/v1/';
axios.defaults.timeout = 3000;

axios.interceptors.request.use(
    (config) => {
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);
axios.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        const msg = error.toString();
        if (msg.includes('NetWorke error')) {
            Message.error('网络错误');
            return Promise.reject(error);
        }
        if (msg.includes('Timeout')) {
            Message.error('网络错误');
            return Promise.reject(error);
        }
        const { status } = err.response;
        switch (status) {
            case 401:
                Message.error('token过期');
                break;
            case 500:
                Message.error('token过期');
                break;
        }
        return Promise.reject(error);
    }
);
export default axios;