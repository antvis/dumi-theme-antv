import { Layout } from 'antd';
import { useLocation, useRouteMeta, useSiteData } from 'dumi';
import React, { type PropsWithChildren } from 'react';
import CommonHelmet from '../../common/CommonHelmet';
import { getNavCategory } from '../Header/utils';
import styles from './index.module.less';
import { Main } from './Main';
import { Sidebar } from './Sidebar';

export const ManualContent: React.FC<PropsWithChildren> = ({ children }) => {
  const meta = useRouteMeta();
  const { title, description } = meta.frontmatter;
  const { themeConfig } = useSiteData();
  const { navs } = themeConfig;
  const { pathname } = useLocation();

  // 获取当前路径对应的导航分类
  const currentCategory = getNavCategory(pathname);

  // 查找匹配的导航配置
  const currentNav = navs.find((nav) => {
    if (!nav.slug) return false;
    const navCategory = getNavCategory(nav.slug);
    return navCategory === currentCategory;
  });

  const shouldShowSidebar = currentNav?.sidebar !== false;

  return (
    <Layout hasSider={shouldShowSidebar} className={styles.layout}>
      <CommonHelmet title={title} description={description} />
      {shouldShowSidebar && <Sidebar />}
      <Main>{children}</Main>
    </Layout>
  );
};
