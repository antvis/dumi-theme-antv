import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { message, Modal } from 'antd';
import { getBaseURL } from './env';
import { getToken, removeToken } from './auth'; // 假设的 Token 管理工具

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

const req: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
});

// 请求拦截器
req.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
req.interceptors.response.use(
  // @ts-ignore - Temporarily ignore type mismatch if it occurs with custom ApiResponse
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data;

    // 业务码非成功状态的统一处理
    if (res.code !== 0 && res.code !== 200) {
      message.error(res.message || 'Error');

      if (res.code === 401) {
        Modal.confirm({
          title: '登录提醒',
          content: '您的登录已过期，请重新登录。',
          okText: '重新登录',
          cancelText: '取消',
          onOk: () => {
            removeToken();
            window.location.href = '/login';
          },
        });
      }

      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      // 成功则直接返回核心业务数据
      return res.data;
    }
  },
  (error) => {
    let errorMessage = error.message;
    if (error.response) {
      switch (error.response.status) {
        case 400: errorMessage = '请求参数错误 (400)'; break;
        case 401: errorMessage = '未授权，请重新登录 (401)'; break;
        case 403: errorMessage = '拒绝访问 (403)'; break;
        case 404: errorMessage = '请求地址不存在 (404)'; break;
        case 500: errorMessage = '服务器内部错误 (500)'; break;
        default: errorMessage = `连接错误 (${error.response.status})!`;
      }
    } else if (errorMessage.includes('timeout')) {
      errorMessage = '请求超时，请检查网络连接！';
    } else {
      errorMessage = '网络连接异常！';
    }

    message.error(errorMessage);
    return Promise.reject(error);
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
