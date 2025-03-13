import { VerticalAlignTopOutlined } from '@ant-design/icons';
import { BackTop, Layout } from 'antd';
import { useRouteMeta } from 'dumi';
import React, { lazy, type PropsWithChildren } from 'react';
import { useMedia } from 'react-use';
import readingTime from 'reading-time';
import ClientOnly from '../../common/ClientOnly';
import InViewSuspense from '../../common/InViewSuspense';
import { ContentTable } from '../ContentTable';
import { Feedback } from '../Feedback';
import styles from './index.module.less';
import { PrevAndNext } from './PrevAndNext';
import ReadingTime from './ReadingTime';

const PageFeedback = lazy(() => import('../Feedback/PageFeedback'));
const ObPreview = lazy(() => import('./ObPreview'));

export const Main: React.FC<PropsWithChildren> = ({ children }) => {
  const meta = useRouteMeta();
  const text = meta.texts.reduce((prev, next) => prev + next.value, '');
  const { time } = readingTime(text);

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
          <div className={styles.readtimeContainer}>
            <ReadingTime readingTime={time} className={styles.readtime} />
          </div>
          <div className={styles.markdown}>{children}</div>
          <div style={{ marginTop: '40px' }}>
            <Feedback />
          </div>
          <PrevAndNext />
        </div>
        <BackTop style={{ right: 24 }}>
          <div className={styles.backTop}>
            <VerticalAlignTopOutlined />
          </div>
        </BackTop>
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
