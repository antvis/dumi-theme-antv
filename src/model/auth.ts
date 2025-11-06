import { proxy } from 'valtio';
import request from '../utils/request';

// 1. 定义 State (只包含数据)
export const authStore = proxy({
  isModalOpen: false,
  isAuthenticated: false,
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

export const initializeAuth = () => {
  if (authStore.token) {
    authStore.isAuthenticated = true;
  }
};
