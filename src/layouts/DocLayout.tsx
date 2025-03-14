import { Helmet, useLocation, useOutlet, useSiteData } from 'dumi';
import React, { useEffect } from 'react';
import { getPurePathname } from '../utils/location';
import IndexLayout from './IndexLayout';
import ManualLayout from './ManualLayout';

// 用户手动添加自己的
import '../slots/_.less';
import '../slots/global';

/**
 * DocLayout 是 dumi2 的内置 layout 入口，在这里使用页面路径进行区分成自己不同的 Layout。
 */
export default () => {
  const { themeConfig, loading } = useSiteData();
  const { navs } = themeConfig;

  // 打印控制台文案
  useEffect(() => {
    console.log('%cAntV 让数据栩栩如生', 'color:#5B7102; font-size: 20px;'),
      console.log('%c新一代数据可视化解决方案', 'color:#5B7102;'),
      console.log('--------------------------'),
      console.log(
        '%c关注我们的微信公众号 %c“数据可视化 AntV”%c，获取我们团队最新的进展、动态、分享，也欢迎加入我们！',
        'color: red',
        'color: pink',
        'color: red',
      );
  }, []);

  const outlet = useOutlet();
  const location = useLocation();
  const { pathname, hash } = location;
  const purePathname = getPurePathname(pathname);

  // 监听 hash 变更，跳转到锚点位置
  // 同时监听页面 loading 状态，因为路由按需加载时需要等待页面渲染完毕才能找到锚点位置
  useEffect(() => {
    const id = hash.replace('#', '');

    if (id) {
      const elm = document.getElementById(decodeURIComponent(id));
      if (elm) document.documentElement.scrollTo(0, elm.offsetTop - 80);
    }
  }, [loading, hash]);

  const content = React.useMemo<React.ReactNode>(() => {
    // 首页
    if (['/', ''].includes(purePathname)) {
      return <IndexLayout>{outlet}</IndexLayout>;
    }

    // 匹配 navs 中的 docs 路由
    const docsRoutes = navs
      .filter((nav) => nav.slug && nav.slug.startsWith('docs/'))
      .map((nav) => nav.slug && nav.slug.split('/').find((item) => item !== 'docs'));

    if (docsRoutes.some((slug) => purePathname.startsWith(`/${slug}`) || purePathname.startsWith(`/docs/${slug}`))) {
      return <ManualLayout>{outlet}</ManualLayout>;
    }

    return outlet;
  }, [purePathname]);

  return (
    <>
      <Helmet>
        {/* 开发环境 dumi 配置 favicon 失效，手动添加*/}
        <link
          rel="shortcut icon"
          href="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*7svFR6wkPMoAAAAAAAAAAAAADmJ7AQ/original"
        />
      </Helmet>
      {content}
    </>
  );
};
