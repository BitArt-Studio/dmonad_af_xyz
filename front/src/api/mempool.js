import axios from 'axios';

// 创建实例
const axiosInstance = axios.create({
  // 前缀
  baseURL: import.meta.env.VITE_MEMPOOL_API,
  // 超时
  timeout: 1000 * 30,
  // 请求头
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    const { data } = response;
    return data;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// mainnet mempool data
export const getFeeRate = () => {
    return axiosInstance.get(`/v1/fees/recommended`);
};

export const getTipHeight = () => {
    return axiosInstance.get(`/blocks/tip/height`);
};
