export function getPurePathname(pathname: string) {
  return pathname.replace('/zh', '').replace('/en', '');
}
