// 判断是否在浏览器环境
export const isBrowser = () => typeof window !== 'undefined' && window;

// 安全访问浏览器 API
// eslint-disable-next-line no-unused-vars
export const safeWindow = <T>(fn: (win: Window) => T): T | undefined => {
  if (isBrowser()) return fn(window)
  return undefined
}

/**
 * 根据当前窗口的域名动态获取 API 的 baseURL
 * @returns {string} API 的 baseURL
 */
export const getBaseURL = (): string => {
  const hostname = window.location.hostname;

  // 生产环境
  if (hostname === 'antv.antgroup.com') {
    return 'https://www.weavefox.cn';
  }

  // 预发环境
  if (hostname.endsWith('-pre.alipay.com')) {
    return 'https://prepub.weavefox.cn';
  }

  // 本地环境
  if (hostname.endsWith('.alipay.net')) {
    return 'https://weavefox.alipay.net:8443';
  }

  return 'https://www.weavefox.cn';
};
