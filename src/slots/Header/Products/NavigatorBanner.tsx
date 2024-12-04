import classNames from 'classnames';
import { FormattedMessage, Link } from 'dumi';
import React from 'react';
import styles from './NavigatorBanner.module.less';

export interface NavigatorBannerProps {
  post?: {
    slug?: string;
    title?: string;
  };
  type: 'prev' | 'next';
}

const NavigatorBanner: React.FC<NavigatorBannerProps> = ({ post, type }) => {
  if (!post) {
    return <div className={classNames(styles.button, styles.hidden)} />;
  }
  const { slug, title } = post;
  if (!slug || !title) {
    return null;
  }
  return (
    <Link to={slug} className={classNames(styles.button, styles[type])}>
      <div className={styles.label}>
        <FormattedMessage id={type === 'prev' ? '上一篇' : '下一篇'} />
      </div>
      <div className={styles.title}>{title}</div>
    </Link>
  );
};

export default NavigatorBanner;
