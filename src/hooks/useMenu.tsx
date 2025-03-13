import { useFullSidebarData, useLocale, useLocation, useNavigate, useSiteData } from 'dumi';
import { get } from 'lodash-es';
import React, { useMemo } from 'react';
import Link from '../common/Link';
import styles from '../slots/ManualContent/index.module.less';
import { getBaseRoute } from '../slots/ManualContent/utils';
import type { FullSidebarData, MenuItem, SidebarData } from '../types';
import { flattenMenu } from '../utils/menu';

export const useMenu = () => {
  const fullData = useFullSidebarData() as FullSidebarData;
  const { pathname } = useLocation();
  const {
    themeConfig: { docs, navs },
  } = useSiteData();
  const baseRoute = getBaseRoute(pathname);
  const navigate = useNavigate();

  const locale = useLocale();
  const currentLocale: string = locale.id;

  const getMenuData = (fullData: FullSidebarData, rootList: SidebarData, hrefId: string) => {
    const fullSidebarDataToMenuData = (rootList: SidebarData, hrefId: string, list: SidebarData) => {
      // 递归
      rootList.forEach((item: MenuItem) => {
        const href = (!baseRoute.startsWith('/en') ? `/${item.slug}` : `/en/${item.slug}`).toLocaleLowerCase();
        const id = href
          .split('/')
          .slice(0, href.split('/').length - 1)
          .join('/');
        if (href.includes(baseRoute)) {
          if (id === hrefId) {
            list.push({
              ...item,
              key: href,
              label: item.title[currentLocale as 'zh' | 'en'],
            });
          }
        }
      });
      for (const item of list) {
        item.children = [];
        fullSidebarDataToMenuData(rootList, item.key, item.children);
        fullData[item.key] &&
          fullData[item.key][0].children?.forEach((itemChild) => {
            const label = itemChild.title as unknown as string;
            const key = itemChild.link as string;
            const tag = get(itemChild, ['frontmatter', 'tag']);
            item.children!.push({
              ...itemChild,
              label: tag ? (
                <Link to={key}>
                  <div className={styles.memuLabel}>
                    {label}
                    <div className={styles.tag}>{tag}</div>
                  </div>
                </Link>
              ) : (
                <Link to={key}>{label}</Link>
              ),
              key,
            });
          });
        // children 的 order 排序
        item.children.sort((a, b) => a.order - b.order);
        if (item.children.length == 0) delete item.children;
      }

      if (hrefId === baseRoute) {
        fullData[baseRoute] &&
          fullData[baseRoute][0].children?.forEach((itemChild) => {
            const key = itemChild.link!;
            const label = itemChild.title as unknown as string;
            list.push({
              ...itemChild,
              label: <Link to={key}>{label}</Link>,
              key,
            });
          });
        list.sort((a, b) => a.order - b.order);
        return list;
      }
    };

    return fullSidebarDataToMenuData(rootList, hrefId, []);
  };

  const menuData = useMemo(() => getMenuData(fullData, docs, baseRoute), [docs, baseRoute, fullData]);

  // 将菜单数据扁平化
  const flattedMenuData = useMemo(() => flattenMenu(menuData), [menuData]);

  let selectedKey = pathname;

  // Nav 跳转但不在菜单中，则选中第一个菜单项
  const navOf = (navs) => navs.some((nav) => nav?.slug?.replace('docs/', '/') === pathname);
  const isNavLink = !!navOf(navs);
  const isExactLink = navOf(navs)?.exact;
  const isLinkInMenu = flattedMenuData.some((item) => item.link === pathname);

  if (isNavLink && !isExactLink && !isLinkInMenu) {
    const firstValidMenuItem = flattedMenuData.find((item) => item.link);
    if (firstValidMenuItem) {
      navigate(firstValidMenuItem.link);
      selectedKey = firstValidMenuItem.link;
    }
  }

  return [menuData, selectedKey, flattedMenuData] as const;
};
