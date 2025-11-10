// 判断是否在浏览器环境
export const isBrowser = () => typeof window !== 'undefined' && window;

// 安全访问浏览器 API
// eslint-disable-next-line no-unused-vars
export const safeWindow = <T>(fn: (win: Window) => T): T | undefined => {
  if (isBrowser()) return fn(window)
  return undefined
}

/**
 * 根据当前环境动态获取 API 的 baseURL。
 * 在浏览器中，它会根据域名判断；在服务端，它会返回一个固定的生产环境地址。
 * @returns {string} API 的 baseURL
 */
export const getBaseURL = (): string => {
  // 关键：检查是否在浏览器环境
  if (typeof window === 'undefined') {
    // === 服务端环境 (SSR/Pre-render) ===
    // 在服务端渲染时，我们无法知道用户最终会通过哪个域名访问。
    // 通常，我们默认返回生产环境的 API 地址。
    // 这样预渲染出的页面如果需要请求数据，会直接请求线上API。
    return 'https://www.weavefox.cn';
  }

  // === 浏览器环境 ===
  const hostname = window.location.hostname;

  // 生产环境
  if (hostname.endsWith('antv.antgroup.com')) {
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

  // 默认返回生产环境地址，适用于其他未知域名（如 localhost）
  return 'https://www.weavefox.cn';
};
