import axios from 'axios';
import showCodeMessage from './code';
import { formatJsonToUrlParams } from '../utils/format';
//import { Toast } from '../components/ui/use-toast.vue'; // 假设您使用了Tailwind UI的toast组件

// 创建实例
const axiosInstance = axios.create({
  // 前缀
  baseURL: import.meta.env.VITE_API_BASEURL,
  //baseURL: 'https://t.bastudio.xyz/app',
  // 超时
  timeout: 1000 * 30,
  // 请求头
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (data.code === 200) {
      return data.data;
    }
    if (data.code === 500) {
      // Toast({
      //   variant: "destructive",
      //   title: "错误",
      //   description: data.msg,
      // });
      console.log(data.msg);
      return Promise.reject(data.msg);
    }
  },
  (error) => {
    const { response } = error;
    if (response) {
      // Toast({
      //   variant: "destructive",
      //   title: "错误",
      //   description: showCodeMessage(response.status),
      // });
      console.log(data.msg);

      return Promise.reject(response.data);
    }
    // Toast({
    //   variant: "warning",
    //   title: "警告",
    //   description: "网络连接异常,请稍后再试!",
    // });
    console.log("网络连接异常,请稍后再试!");
    return Promise.reject(error);
  },
);

const service = {
  get(url, data) {
    return axiosInstance.get(url, { params: data });
  },

  post(url, data) {
    return axiosInstance.post(url, data);
  },

  put(url, data) {
    return axiosInstance.put(url, data);
  },

  delete(url, data) {
    return axiosInstance.delete(url, data);
  },

  upload: (url, file) =>
    axiosInstance.post(url, file, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  download: (url, data) => {
    window.location.href = `${import.meta.env.VITE_API_BASEURL}/${url}?${formatJsonToUrlParams(data)}`;
  },
};

export default service;