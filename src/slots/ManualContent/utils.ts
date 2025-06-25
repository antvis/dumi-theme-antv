import { isEmpty } from 'lodash-es';

/**
 *  /api/xxx -->  /api
 *  /en/api  -->  /en/api
 */
export function getBaseRoute(pathname: string) {
  let matchRoute = pathname;
  // 兼容 zh
  matchRoute = matchRoute.replace('/zh/', '/');
  // 兼容带有docs的route
  matchRoute = matchRoute.replace('/docs', '');
  // 查找 baseRoute
  const reg = pathname.startsWith('/en') ? /(\/[A-z]*\/?\/[A-z]*)\/?/ : /(\/[A-z]*)\/?/;
  const mainRoute = matchRoute.match(reg);
  return mainRoute![1];
}

export function getIndexRoute(menuData) {
  if (isEmpty(menuData)) return undefined;
  let topRoute = menuData[0];
  while (!isEmpty(topRoute.children)) {
    topRoute = topRoute.children[0];
  }
  return topRoute.key;
}

/**
 * 返回需要跳转的 pathname
 * /en/api/ ----> /en/api/[first-doc]
 * /zh/api/ ----> /api/[first-doc]
 * /en/docs/api/ ----> /en/api/[first-doc]
 * /zh/docs/api/ ----> /api/[first-doc]
 *
 * /en/docs/api/xxx ----> /en/api/xxx
 * /zh/docs/api/xxx ----> /api/xxx
 *
 * /docs/api/xxx -----> /api/xxx
 *
 * @param p
 */
export function getNavigateUrl(pathname: string, first: string, siderbarMenu: any[]) {
  // 兜底 如果 nav 指定有误则自动重定向到 indexDocRoute
  if (pathname.includes('/docs/') || pathname.includes('/zh/')) {
    return pathname.replace('/docs/', '/').replace('/zh/', '/');
  }
  if (
    siderbarMenu.every((item) => {
      const itemLowerCase = `${item}`.toLowerCase();
      return ![itemLowerCase, `${itemLowerCase}/`].includes(pathname.toLowerCase());
    })
  ) {
    return first;
  }
  return pathname;
}

export function safeEval(source) {
  try {
    // 如果代码以 (() => 或 (function 开头，说明是IIFE，直接执行
    const trimmedSource = source.trim();
    if (trimmedSource.startsWith('(') && (trimmedSource.includes('=>') || trimmedSource.includes('function'))) {
      return new Function(`return ${source}`)();
    }

    // 尝试作为表达式执行
    try {
      return new Function(`return ${source}`)();
    } catch (e) {
      // 如果作为表达式失败，尝试作为语句执行
      return new Function(source)();
    }
  } catch (error) {
    console.error('代码执行错误:', error);
    throw error;
  }
}
