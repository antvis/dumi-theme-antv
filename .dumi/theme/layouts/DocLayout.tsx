import React from 'react';
import { useOutlet, useLocation } from 'dumi';
import { Index } from './entry/Index';
import { API } from './entry/API';
import { Manual } from './entry/Manual';
import * as _ from 'lodash-es';
import insertCss from 'insert-css';
// 用户手动添加自己的
import '../slots/global';

import '../slots/_.less';

// 挂载一些全局变量
if (window) {
  (window as any).lodash = _;
  (window as any).insertCss = insertCss;
}

/**
 * DocuLayout 是 dumi2 的内置 layout 入口，在这里使用页面路径进行区分成自己不同的 Layout。
 */
export default () => {
  const outlet = useOutlet();
  const { pathname } = useLocation();
  const p = pathname.toLowerCase();

  // @todo 南洋
  // 做一些跳转，比如：/zh/examples/xxx -> /examples/xxx

  // 首页
  if (p === '/' || p === '/en' || p === '/en/') return <Index />;

  // API 页面
  if (
    p.startsWith('/api') || p.startsWith('/en/api') ||
    // 这两个是兼容之前的
    p.startsWith('/zh/docs/api') || p.startsWith('/en/docs/api') 
  ) {
    return <API> {outlet} </API>
  }

  // 教程页面
  if (
    p.startsWith('/manual') || p.startsWith('/en/manual') ||
    // 这两个是兼容之前的
    p.startsWith('/zh/docs/manual/') || p.startsWith('/en/docs/manual/')
  ) {
    return <Manual> {outlet} </Manual>;
  }

  // More router, add here...

  return outlet;
};
