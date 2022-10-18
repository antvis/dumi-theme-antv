import React from 'react';
import { Layout, Affix, BackTop } from 'antd';
import { useMedia } from 'react-use';

import styles from './index.module.less';
import markdown from './markdown.module.less';

export type ManualContent = {
  readonly children: any;
};

/**
 * 文档的结构
 */
export const ManualContent: React.FC<ManualContent> = ({ children }) => {
  const isWide = useMedia('(min-width: 767.99px)', true);
  return (
    <>
      <Layout>
        <Affix
          offsetTop={0}
          className={styles.affix}
          style={{ height: isWide ? '100vh' : 'inherit' }}
        >
          <Layout.Sider theme="light">Menu</Layout.Sider>
        </Affix>
        
        <Layout.Content>
          <div className={styles.title}>项目介绍</div>
          <div className={styles.readtime}>阅读时间 6 分钟</div>
          <div className={markdown.markdown}>
            { children }
          </div>
          <div className={styles.navigator}>
            <div className={styles.prev}>Prev</div>
            <div className={styles.next}>Next</div>
          </div>
          <BackTop />
        </Layout.Content>
        <Layout.Sider theme="light">TOC</Layout.Sider>
      </Layout>
    </>
  );
};

