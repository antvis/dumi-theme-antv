import { VerticalAlignTopOutlined } from '@ant-design/icons';
import { FloatButton, Layout } from 'antd';
import { useRouteMeta } from 'dumi';
import React, { lazy, type PropsWithChildren } from 'react';
import { useMedia } from 'react-use';
import ClientOnly from '../../common/ClientOnly';
import InViewSuspense from '../../common/InViewSuspense';
import { ContentTable } from '../ContentTable';
import { Feedback } from '../Feedback';
import styles from './index.module.less';
import { PrevAndNext } from './PrevAndNext';

const PageFeedback = lazy(() => import('../Feedback/PageFeedback'));
const ObPreview = lazy(() => import('./ObPreview'));

export const Main: React.FC<PropsWithChildren> = ({ children }) => {
  const meta = useRouteMeta();

  const is991Wide = useMedia('(min-width: 991.99px)', true);
  const showToc = is991Wide && meta.frontmatter.showToc !== false;

  return (
    <>
      <ClientOnly>
        <ObPreview />
      </ClientOnly>
      <Layout.Content className={styles.content}>
        <div className={styles.main}>
          <h1 className={styles.contentTitle}>{meta.frontmatter.title}</h1>
          <div className={styles.markdown}>{children}</div>
          <ClientOnly>
            <div style={{ marginTop: '40px' }}>
              <Feedback />
            </div>
          </ClientOnly>
          <PrevAndNext />
        </div>
        <FloatButton.BackTop style={{ right: 24 }}>
          <div className={styles.backTop}>
            <VerticalAlignTopOutlined />
          </div>
        </FloatButton.BackTop>
      </Layout.Content>
      {showToc && (
        <Layout.Sider theme="light" width={260}>
          <div className={styles.toc}>
            <InViewSuspense>
              <PageFeedback />
            </InViewSuspense>
            <ContentTable />
          </div>
        </Layout.Sider>
      )}
    </>
  );
};
