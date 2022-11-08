import React from 'react';
import cx from 'classnames';
import { isEqual, size } from 'lodash-es';
import { Link, useLocale } from 'dumi';
import { Dropdown, Menu } from 'antd';
import { DownOutlined, LinkOutlined } from '@ant-design/icons';

import styles from './index.module.less';

type dropdownItem = {
  name: {
    [key: string]: string;
  },
  url: string
}

export type INav = {
  slug?: string;
  order: number;
  title: {
    [key: string]: string;
  };
  target?: '_blank';
  notPage?: boolean,
  dropdownItems?: dropdownItem[]
}

export type NavProps = {
  navs: INav[];
  path: string;
}

/**
 * Header 中的导航菜单
 */
export const Navs: React.FC<NavProps> = ({ navs, path }) => {
  const locale = useLocale();
  return (
    <>
      {navs.map((nav: INav) => {
        const title = nav.title[locale.id];
        let href = ''
        let className = ''
        if (nav.slug) {
          href = nav.slug.startsWith('http')
            ? nav.slug
            : `/${nav.slug}`;
          if (locale.id == 'en' && !href.startsWith('http') ) {
            href = `/en${href}`;
          }
          // 去除 docs  防止二次点击相同nav跳转出现04
          href = href.replace('/docs/', '/')
          className = cx('header-menu-item-active', {
            [styles.activeItem]:
              path.startsWith(href) ||
              isEqual(
                path.split('/').slice(0, 4),
                href.split('/').slice(0, 4)
              )
          });
       }
        return (
          size(nav.dropdownItems) ? 
            (
              <li key={title} className={className}>
                <Dropdown
                  className={styles.ecoSystems}
                  placement="bottom"
                  overlay={
                    <Menu>
                      {nav.dropdownItems.map(({ name, url }) => (
                        <Menu.Item key={url}>
                          <a target="_blank" rel="noreferrer" href={url}>
                            {name[locale.id]} <LinkOutlined />
                          </a>
                        </Menu.Item>
                      ))}
                    </Menu>
                  }
                >
                  <span>
                    {title}
                    <DownOutlined />
                  </span>
                </Dropdown>
            </li>
            )
            :
           ( <li key={title} className={className}>
              {nav.target === '_blank' || href.startsWith('http') ? (
              <a href={href} target='_blank' rel='noreferrer'>
                {title}
                <LinkOutlined />
              </a>
              ) : (
               <Link to={href}>{title}</Link>
             )}
              </li>
            )
          )
      })}
    </>
  );
};
