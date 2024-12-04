import { Layout } from 'antd';
import React from 'react';
import styles from './index.module.less';

const Article: React.FC<any> = (props) => (
  <Layout.Content className={styles.article}>
    <article {...props} />
  </Layout.Content>
);

export default Article;
