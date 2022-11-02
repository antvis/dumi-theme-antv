import React, { useEffect } from 'react';
import { useOutlet, useLocation } from 'dumi';
import { Index } from './entry/Index';
import { API } from './entry/API';
import { Manual } from './entry/Manual';
// 用户手动添加自己的
import '../slots/global';

import '../slots/_.less';

/**
 * DocuLayout 是 dumi2 的内置 layout 入口，在这里使用页面路径进行区分成自己不同的 Layout。
 */
export default () => {

  // 打印控制台文案
  useEffect(() => {
    console.log("%cAntV 让数据栩栩如生", "color:#5B7102; font-size: 20px;"),
    console.log("%c新一代数据可视化解决方案", "color:#5B7102;"),
    console.log("--------------------------"),
    console.log("%c关注我们的微信公众号 %c“数据可视化 AntV”%c，获取我们团队最新的进展、动态、分享，也欢迎加入我们！", "color: red", "color: pink", "color: red");
  }, []);

  const outlet = useOutlet();
  const { pathname } = useLocation();
  const p = pathname.toLowerCase();

  // 首页
  if (p === '/' || p === '/zh'|| p === '/en' || p === '/en/') return <Index />;

  // API 页面
  if (
    p.startsWith('/api') || p.startsWith('/en/api') ||
    // 这四个是兼容之前的
    p.startsWith('/zh/api') || p.startsWith('/en/api') ||
    p.startsWith('/zh/docs/api') || p.startsWith('/en/docs/api')
  ) {
    return <API> {outlet} </API>
  }

  // 教程页面
  if (
    p.startsWith('/manual') || p.startsWith('/en/manual') ||
    // 这四个是兼容之前的
    p.startsWith('/zh/manual') || p.startsWith('/en/manual') ||
    p.startsWith('/zh/docs/manual/') || p.startsWith('/en/docs/manual/')
  ) {
    return <Manual> {outlet} </Manual>;
  }

  // More router, add here...

  return outlet;
};
