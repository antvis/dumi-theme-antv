// 判断是否在浏览器环境
export const isBrowser = () => typeof window !== 'undefined' && window;

// 安全访问浏览器 API
// eslint-disable-next-line no-unused-vars
export const safeWindow = <T>(fn: (win: Window) => T): T | undefined => {
  if (isBrowser()) return fn(window)
  return undefined
}

/**
 * 环境类型枚举
 */
export type EnvType = 'dev' | 'pre' | 'prod';

/**
 * 获取当前环境类型
 * @returns {EnvType} 当前环境类型
 */
export const getEnv = (): EnvType => {
  // 服务端环境默认返回生产环境
  if (typeof window === 'undefined') {
    return 'prod';
  }

  const hostname = window.location.hostname;

  // 生产环境
  if (hostname.endsWith('antv.antgroup.com')) {
    return 'prod';
  }

  // 预发环境
  if (hostname.endsWith('-pre.alipay.com')) {
    return 'pre';
  }

  // 本地环境
  if (hostname.endsWith('.alipay.net')) {
    return 'dev';
  }

  // 默认返回生产环境
  return 'prod';
};

/**
 * 根据当前环境动态获取 API 的 baseURL。
 * 在浏览器中，它会根据域名判断；在服务端，它会返回一个固定的生产环境地址。
 * @returns {string} API 的 baseURL
 */
export const getBaseURL = (): string => {
  const env = getEnv();

  switch (env) {
    case 'dev':
      return 'https://weavefox.alipay.net:8443';
    case 'pre':
      return 'https://prepub.weavefox.cn';
    case 'prod':
    default:
      return 'https://www.weavefox.cn';
  }
};

export const getBaseSiteDataUrl = () => {
  const env = getEnv();

  switch (env) {
    case 'dev':
    case 'pre':
      return 'https://site-data-pre.alipay.com';
    case 'prod':
    default:
      return 'https://assets.antv.antgroup.com';
  }
}
