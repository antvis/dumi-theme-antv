/**
 * 请求超时包装函数
 */
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout: number = 3000): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

let isInternalUser: boolean | undefined;

/**
 * 通过请求一个内网资源来判断用户类型
 */
export const determineUserType = async (): Promise<boolean> => {
  if (isInternalUser !== undefined) {
    return isInternalUser;
  }

  const url = 'https://webgw.antgroup-inc.cn/180020010001271369/visservice/api/oneclip';
  const timeout = 5000; // 请求超时设置

  try {
    await fetchWithTimeout(url, {}, timeout);
    isInternalUser = true;
  } catch (error) {
    isInternalUser = false;
  }

  return isInternalUser;
};
