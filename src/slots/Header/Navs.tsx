import React from 'react';
import cx from 'classnames';
import { isEqual } from 'lodash-es';
import { LinkOutlined } from '@ant-design/icons';
import { Link, useLocale } from 'dumi';

import styles from './index.module.less';

export type INav = {
  slug: string;
  order: number;
  title: {
    [key: string]: string;
  };
  target?: '_blank';
}

export type NavProps = {
  navs: INav[];
  path: string;
}

const getDocument = (navs: INav[], slug = '') =>
  navs.find(doc => doc.slug === slug) || {
    title: {} as { [key: string]: string }
  };

/**
 * Header 中的导航菜单
 */
export const Navs: React.FC<NavProps> = ({ navs, path }) => {
  const locale = useLocale();
  return (
    <>
      {navs.map((nav: INav) => {
        let href = nav.slug.startsWith('http')
          ? nav.slug
          : `/${nav.slug}`;
        const title = getDocument(navs, nav.slug).title[locale.id];
        href = nav.slug.startsWith('/')
          ? nav.slug
          : `/${nav.slug}`;
        if (window.location.pathname.includes('en')) {
          href = `/en${href}`;
        }
        // 去除 docs  防止二次点击相同nav跳转出现04
        href = href.replace('/docs/', '/')
        const className = cx('header-menu-item-active', {
          [styles.activeItem]:
          path.startsWith(href) ||
          isEqual(
            path.split('/').slice(0, 4),
            href.split('/').slice(0, 4)
            )
        });
        return (
          <li key={title} className={className}>
            {nav.target === '_blank' || href.startsWith('http') ? (
              <a href={href} target='_blank' rel='noreferrer'>
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
