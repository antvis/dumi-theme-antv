import { proxy } from 'valtio';
import request from '../utils/request';

/**
 * 检查当前 URL 是否包含 'skipLogin=1' 参数
 * @returns {boolean} 如果包含则返回 true, 否则返回 false
 */
function hasSkipLoginParam() {
  // 1. 获取当前 URL 的查询字符串 (例如 "?foo=bar&skipLogin=1")
  const queryString = window.location.search;

  // 2. 创建一个 URLSearchParams 实例
  const urlParams = new URLSearchParams(queryString);

  // 3. 使用 .get() 方法获取 'skipLogin' 参数的值，并判断是否为 '1'
  // 注意：URL参数的值总是字符串类型，所以我们用 '1' 而不是 1 进行比较。
  return urlParams.get('skipLogin') === '1';
}

// 1. 定义 State (只包含数据)
export const authStore = proxy({
  isModalOpen: false,
  isAuthenticated: true,
  token: localStorage.getItem('authToken'),
});

// 2. 定义 Actions (作为独立函数)
export const showLoginModal = () => {
  authStore.isModalOpen = true;
};

export const hideLoginModal = () => {
  authStore.isModalOpen = false;
};

export const loginOrRegister = async (params) => {
  try {
    const result = await request.post('/api/modules/user/api/accounts/login_or_register', params);

    authStore.token = result.token;
    authStore.isAuthenticated = true;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', result.token);
    }

    hideLoginModal();
    return true;
  } catch (error) {
    console.error('Login failed in store:', error);
    return false;
  }
};

export const logout = () => {
  try {
    request.delete<void>('/api/modules/user/api/accounts/logout')
  } catch (e) {
    console.error('Logout failed in store:', e);
  }finally {
    authStore.token = null;
    authStore.isAuthenticated = false;
    localStorage.removeItem('authToken');
  }
};

export function sendValidationCode(data: any): Promise<void> {
  return request.post('/api/modules/user/api/validation_code/send', data);
}

export const initializeAuth = async () => {
  try{
    if (!hasSkipLoginParam()) {
      await request.get('/api/modules/user/api/accounts/get_company_info')
    }
    authStore.isAuthenticated = true;
  } catch (e) {
    console.error('Initialize auth failed in store:', e)
    authStore.isAuthenticated = false;
  }
};
