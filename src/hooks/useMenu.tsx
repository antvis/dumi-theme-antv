import { useFullSidebarData, useLocale, useLocation, useSiteData } from 'dumi';
import { get } from 'lodash-es';
import React, { useCallback, useMemo } from 'react';
import Link from '../common/Link';
import { icWithLocale } from '../slots/hooks';
import styles from '../slots/ManualContent/index.module.less';
import { getBaseRoute } from '../slots/ManualContent/utils';
import type { FullSidebarData, MenuItem, SidebarData } from '../types';
import { flattenMenu } from '../utils/menu';

/**
 * 根据 baseRoute 获取特定的菜单数据（纯函数）
 */
export const getMenuData = (fullData: FullSidebarData, rootList: SidebarData, baseRoute: string, locale: string) => {
  const getMenuDataInternal = (fullData: FullSidebarData, rootList: SidebarData, hrefId: string) => {
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
              label: icWithLocale(item.title, locale),
            });
          }
        }
      });
      for (const item of list) {
        item.children = [];
        fullSidebarDataToMenuData(rootList, item.key, item.children);
        if (fullData[item.key]) {
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
        }
        // children 的 order 排序
        item.children.sort((a, b) => a.order - b.order);
        if (item.children.length === 0) delete item.children;
      }

      if (hrefId === baseRoute) {
        if (fullData[baseRoute]) {
          fullData[baseRoute][0].children?.forEach((itemChild) => {
            const key = itemChild.link!;
            const label = itemChild.title as unknown as string;
            list.push({
              ...itemChild,
              label: <Link to={key}>{label}</Link>,
              key,
            });
          });
        }
        list.sort((a, b) => a.order - b.order);
        return list;
      }
    };

    return fullSidebarDataToMenuData(rootList, hrefId, []);
  };

  return getMenuDataInternal(fullData, rootList, baseRoute);
};

/**
 * 通过 hooks 包装的 getMenuData
 */
export const useMenuData = () => {
  const fullData = useFullSidebarData() as FullSidebarData;
  const {
    themeConfig: { docs },
  } = useSiteData();
  const locale = useLocale();

  const getter = useCallback(
    (baseRoute: string) => {
      return getMenuData(fullData, docs, baseRoute, locale.id);
    },
    [fullData, docs, locale.id],
  );

  return getter;
};

export const useMenu = () => {
  const { pathname } = useLocation();
  const baseRoute = getBaseRoute(pathname);

  const getMenuDataFn = useMenuData();

  const menuData = useMemo(() => getMenuDataFn(baseRoute), [getMenuDataFn, baseRoute]);

  // 将菜单数据扁平化
  const flattedMenuData = useMemo(() => flattenMenu(menuData), [menuData]);

  return [menuData, pathname, flattedMenuData] as const;
};
