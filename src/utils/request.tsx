import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { getBaseURL } from './env';
import { getToken } from './auth';

const req: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 60000,
  withCredentials: true,
});

// 响应拦截器
req.interceptors.response.use(
  // @ts-ignore - Temporarily ignore type mismatch if it occurs with custom ApiResponse
  (response: AxiosResponse<any>) => {
    return response.data;
  }
);

/**
 * 封装通用请求方法
 * @template T - 期望的响应数据类型 (后端返回的 data 字段)
 */
const request = {
  get: <T = any>(url: string, params?: object, config?: InternalAxiosRequestConfig): Promise<T> => {
    return req.get(url, { params, ...config });
  },

  post: <T = any>(url: string, data?: object, config?: InternalAxiosRequestConfig): Promise<T> => {
    return req.post(url, data, config);
  },

  put: <T = any>(url: string, data?: object, config?: InternalAxiosRequestConfig): Promise<T> => {
    return req.put(url, data, config);
  },

  delete: <T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<T> => {
    return req.delete(url, config);
  },
};

export default request;
