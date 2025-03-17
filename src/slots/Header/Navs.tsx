import { DownOutlined, LinkOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import cx from 'classnames';
import { Link, useLocale } from 'dumi';
import { size } from 'lodash-es';
import React from 'react';
import { useMenuData } from '../../hooks/useMenu';
import styles from './index.module.less';
import { getNavCategory } from './utils';

type dropdownItem = {
  name: {
    [key: string]: string;
  };
  url: string;
  target?: '_blank';
};

export type INav = {
  // 链接
  slug?: string;
  // 排序
  order: number;
  // 标题
  title: {
    [key: string]: string;
  };
  // 是否新窗口打开
  target?: '_blank';
  // 是否精确匹配
  exact?: boolean;
  // 是否不生成页面
  notPage?: boolean;
  // 下拉菜单
  dropdownItems?: dropdownItem[];
};

export type NavProps = {
  navs: INav[];
  path: string;
};

function getNavMeta(pathname: string, navs: INav[]) {
  return navs.find((nav) => nav?.slug?.replace('docs/', '/') === pathname);
}

function isExactNavLink(pathname: string, navs: INav[]) {
  const meta = getNavMeta(pathname, navs);
  return !!meta && meta.exact;
}

/**
 * 查找与路径匹配的第一个菜单项
 */
function findMatchingMenuItem(pathname: string, menuData: any[]): any | null {
  if (!menuData || !Array.isArray(menuData) || menuData.length === 0) {
    return null;
  }

  for (const menuItem of menuData) {
    if (menuItem.link) {
      const normalizedLink = menuItem.link.startsWith('/') ? menuItem.link : `/${menuItem.link}`;

      if (normalizedLink === pathname || normalizedLink.startsWith(pathname)) {
        return menuItem;
      }
    }

    if (menuItem.children && menuItem.children.length > 0) {
      const matchedChild = findMatchingMenuItem(pathname, menuItem.children);
      if (matchedChild) return matchedChild;
    }
  }

  return null;
}

function getNavLink(pathname: string, navs: INav[], menuData: any) {
  if (isExactNavLink(pathname, navs)) {
    return pathname;
  }
  const matchingMenuItem = findMatchingMenuItem(pathname, menuData);
  if (matchingMenuItem) {
    return matchingMenuItem.link;
  }
  return pathname;
}

/**
 * Header 中的导航菜单
 */
export const Navs: React.FC<NavProps> = ({ navs, path }) => {
  const locale = useLocale();

  const getMenuData = useMenuData();

  return (
    <>
      {navs.map((nav: INav) => {
        const title = nav.title[locale.id];
        let href = '';
        let className = '';
        if (nav.slug) {
          if (nav.slug.startsWith('http')) {
            href = nav.slug;
          } else {
            // 去除 docs 防止新页面 404 和 本页重新刷新。
            href = `/${nav.slug}`.replace(/^\/docs(?=\/)/, '');

            if (locale.id === 'en') {
              href = `/en${href}`;
            }
            href = getNavLink(href, navs, getMenuData(href));
          }

          className = cx('header-menu-item-active', {
            [styles.activeItem]: getNavCategory(path) === getNavCategory(href),
          });
        }

        return size(nav.dropdownItems) ? (
          <li key={title} className={className}>
            <Dropdown
              className={styles.ecoSystems}
              placement="bottom"
              overlay={
                <Menu>
                  {nav.dropdownItems.map(({ name, url, target }) => {
                    const displayName = name[locale.id];
                    return (
                      <Menu.Item key={url}>
                        {target === '_blank' || url.startsWith('http') ? (
                          <a href={url} target="_blank" rel="noreferrer">
                            {displayName}
                            <LinkOutlined />
                          </a>
                        ) : (
                          <Link to={url}>{displayName}</Link>
                        )}
                      </Menu.Item>
                    );
                  })}
                </Menu>
              }
            >
              <span>
                {title}
                <DownOutlined style={{ marginLeft: '6px' }} />
              </span>
            </Dropdown>
          </li>
        ) : (
          <li key={title} className={className}>
            {nav.target === '_blank' || href.startsWith('http') ? (
              <a href={href} target="_blank" rel="noreferrer">
                {title}
                <LinkOutlined />
              </a>
            ) : (
              <Link to={href}>{title}</Link>
            )}
          </li>
        );
      })}
    </>
  );
};
