/**
 * 统一去掉中英文前缀
 */
export function getPurePathname(pathname: string) {
  return pathname.replace('/zh', '').replace('/en', '');
}
