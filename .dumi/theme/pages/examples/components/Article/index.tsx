import React from 'react';
import { Layout } from 'antd';
import styles from './style.less';

export const Article: React.FC<any> = props => (
  <Layout.Content className={styles.article}>
    <article {...props} />
  </Layout.Content>
);
