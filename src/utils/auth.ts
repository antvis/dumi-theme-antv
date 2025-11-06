const TokenKey = 'My-App-Token';
export const getToken = () => localStorage.getItem(TokenKey);
export const setToken = (token: string) => localStorage.setItem(TokenKey, token);
export const removeToken = () => localStorage.removeItem(TokenKey);
