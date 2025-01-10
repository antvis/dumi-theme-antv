import { VerticalAlignTopOutlined } from '@ant-design/icons';
import { BackTop, Layout } from 'antd';
import { useRouteMeta } from 'dumi';
import React, { type PropsWithChildren } from 'react';
import { useMedia } from 'react-use';
import readingTime from 'reading-time';
import { useMenu } from '../../hooks/useMenu';
import { ContentTable } from '../ContentTable';
import { Feedback } from '../Feedback';
import { PrevAndNext } from './PrevAndNext';
import ReadingTime from './ReadingTime';
import styles from './index.module.less';
import { usePreview } from './usePreview';

export const Main: React.FC<PropsWithChildren> = ({ children }) => {
  const meta = useRouteMeta();

  const text = meta.texts.reduce((prev, next) => prev + next.value, '');
  const { time } = readingTime(text);

  const [, selectedKey] = useMenu();

  const is991Wide = useMedia('(min-width: 991.99px)', true);
  const showToc = is991Wide && meta.frontmatter.showToc !== false;

  usePreview({}, selectedKey);

  return (
    <>
      <Layout.Content className={styles.content}>
        <div className={styles.main}>
          <h1 className={styles.contentTitle}>{meta.frontmatter.title}</h1>
          <div className={styles.readtimeContainer}>
            <ReadingTime readingTime={time} className={styles.readtime} />
          </div>
          <div className={styles.markdown}>{children}</div>
          <Feedback />
          <PrevAndNext />
        </div>
        <BackTop style={{ right: 32, bottom: 100 }}>
          <div className={styles.backTop}>
            <VerticalAlignTopOutlined />
          </div>
        </BackTop>
      </Layout.Content>
      {showToc && (
        <Layout.Sider theme="light" width={260}>
          <div className={styles.toc}>
            <ContentTable />
          </div>
        </Layout.Sider>
      )}
    </>
  );
};
