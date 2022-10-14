import React from 'react';
import cx from 'classnames';
import { isEqual } from 'lodash-es';
import { LinkOutlined } from '@ant-design/icons';
import { Link } from 'dumi';

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
    title: {} as { [key: string]: string },
  };

/**
 * Header 中的导航菜单
 */
export const Navs: React.FC<NavProps> = ({ navs, path }) => {
  return (
    <>
      {navs.map((nav: INav) => {
        const href = nav.slug.startsWith('http')
          ? nav.slug
          : `/${nav.slug}`;

        const title = getDocument(navs, nav.slug).title['zh'];
        const className = cx('header-menu-item-active', {
          [styles.activeItem]:
            path.startsWith(href) ||
            isEqual(
              path.split('/').slice(0, 4),
              href.split('/').slice(0, 4),
            ),
        });
        return (
          <li key={title} className={className}>
            {nav.target === '_blank' || href.startsWith('http') ? (
              <a href={href} target="_blank">
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
  )
};
