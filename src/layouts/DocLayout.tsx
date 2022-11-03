import React, { useEffect } from 'react';
import { useOutlet, useLocation, useSiteData } from 'dumi';
import { Index } from './entry/Index';
import { Manual } from './entry/Manual';
// 用户手动添加自己的
import '../slots/global';

import '../slots/_.less';

/**
 * DocuLayout 是 dumi2 的内置 layout 入口，在这里使用页面路径进行区分成自己不同的 Layout。
 */
export default () => {
  const { themeConfig } = useSiteData();
  const {
    navs
  } = themeConfig;

  // 打印控制台文案
  useEffect(() => {
    console.log("%cAntV 让数据栩栩如生", "color:#5B7102; font-size: 20px;"),
    console.log("%c新一代数据可视化解决方案", "color:#5B7102;"),
    console.log("--------------------------"),
    console.log("%c关注我们的微信公众号 %c“数据可视化 AntV”%c，获取我们团队最新的进展、动态、分享，也欢迎加入我们！", "color: red", "color: pink", "color: red");
  }, []);

  const outlet = useOutlet();
  const { pathname } = useLocation();
  const path = pathname
  // 统一去掉中英文前缀
  let p = path.replace('/zh/', '/').replace('/en/', '/')
  // 首页
  if (p === '/' || p === '/zh' || p === '/en' || p === '/en/') return <Index />;

  // 匹配 navs 中的 docs 路由
  const hasDocsRoutes = navs.filter(nav => nav.slug.startsWith('docs/'))
  const docsRoutes = hasDocsRoutes.map(nav => nav.slug.split('/').find(item => item !== 'docs'))
  if (docsRoutes.some(route => {
    return p.startsWith(`/${route}`) || p.startsWith(`/docs/${route}`) 
  })) {
    return <Manual>{outlet}</Manual>      
  }
  
    return outlet;
};
