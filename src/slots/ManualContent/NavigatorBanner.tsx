import classNames from 'classnames';
import { history, useIntl } from 'dumi';
import React from 'react';
import { useScrollToTop } from '../hooks';
import styles from './NavigatorBanner.module.less';

export interface NavigatorBannerProps {
  post?:
    | {
        slug?: string;
        title?: string;
      }
    | undefined;
  type: 'prev' | 'next';
}

export const NavigatorBanner: React.FC<NavigatorBannerProps> = ({ post, type }) => {
  const { formatMessage } = useIntl();

  if (!post) {
    return <div className={classNames(styles.button, styles.hidden)} />;
  }

  const { slug, title } = post;
  if (!slug || !title) {
    return null;
  }

  function go() {
    history.push(slug as string);
    useScrollToTop();
  }

  return (
    <div className={classNames(styles.button, styles[type])} onClick={go}>
      <div className={styles.label}>{formatMessage({ id: type === 'prev' ? '上一篇' : '下一篇' })}</div>
      <div className={styles.title}>{title}</div>
    </div>
  );
};
