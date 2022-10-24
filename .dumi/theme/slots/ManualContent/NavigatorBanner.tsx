import React from 'react';
import classNames from 'classnames';
import { history } from 'umi';
import { useTranslation } from 'react-i18next';
import styles from './NavigatorBanner.module.less';
import { useScrollToTop } from '../hooks';

export interface NavigatorBannerProps {
  post?: {
    slug?: string;
    title?: string;
  } | undefined;
  type: 'prev' | 'next';
}

export const NavigatorBanner: React.FC<NavigatorBannerProps> = ({ post, type }) => {
  const { t } = useTranslation();
  if (!post) {
    return <div className={classNames(styles.button, styles.hidden)} />;
  }
  const { slug, title } = post;
  if (!slug || !title) {
    return null;
  }

  function go() {
    history.push(slug as string)
    useScrollToTop()
  }

 
  return (
    <div className={classNames(styles.button, styles[type])} onClick={go}>
      <div className={styles.label}>
        {t(type === 'prev' ? '上一篇' : '下一篇')}
      </div>
      <div className={styles.title}>{title}</div>
   </div>
  );
};

