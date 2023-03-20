import * as path from 'path';
import * as fs from 'fs';

export function winPath(path: string) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path);
  if (isExtendedLengthPath) {
    return path;
  }
  return path.replace(/\\/g, '/');
}

/**
 * 自定义的 resolve 函数，优先找 tsx，如果找不到则找对应的 js 文件。
 * 因为 dumi-theme-antv 编译之后，全部变成 js 文件
 */
export function myResolve(p: string, alternateExts: string[] = ['.js']): string {
  const extname = path.extname(p);
  const pathname = p.slice(0, p.length - extname.length);
  const exts = [extname, ...alternateExts];

  for (let i = 0; i < exts.length; i++) {
    const ext = exts[i];
    const fullpath = `${pathname}${ext}`;

    // 找到一个，则终止
    // 如果文件不存在，则会 throw error
    try {
      return winPath(require.resolve(fullpath));
    } catch (e) {}
  }

  // 找不到，返回空
  return '';
}
