import { VerticalAlignTopOutlined } from '@ant-design/icons';
import { BackTop, Layout } from 'antd';
import { useRouteMeta } from 'dumi';
import React, { type PropsWithChildren, useMemo } from 'react';
import { useMedia } from 'react-use';
import readingTime from 'reading-time';
import { useMenu } from '../../hooks/useMenu';
import { ContentTable } from '../ContentTable';
import { NavigatorBanner } from './NavigatorBanner';
import ReadingTime from './ReadingTime';
import styles from './index.module.less';
import { usePreview } from './usePreview';

export const Main: React.FC<PropsWithChildren> = ({ children }) => {
  const meta = useRouteMeta();

  const text = meta.texts.reduce((prev, next) => prev + next.value, '');
  const { time } = readingTime(text);

  const [, selectedKey, flattenMenuItems] = useMenu();

  const [prev, next] = useMemo(() => {
    if (!flattenMenuItems) {
      return [undefined, undefined];
    }

    let activeMenuItemIndex = -1;
    flattenMenuItems.forEach((menuItem, i) => {
      if (menuItem && menuItem.key === selectedKey) {
        activeMenuItemIndex = i;
      }
    });
    const prevItem = flattenMenuItems[activeMenuItemIndex - 1];
    const nextItem = flattenMenuItems[activeMenuItemIndex + 1];
    return [
      prevItem ? { slug: prevItem.link, title: prevItem.title } : undefined,
      nextItem ? { slug: nextItem.link, title: nextItem.title } : undefined,
    ] as const;
  }, [flattenMenuItems, selectedKey]);

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
          <div>
            <div className={styles.preandnext}>
              <NavigatorBanner type="prev" post={prev} />
              <NavigatorBanner type="next" post={next} />
              <BackTop style={{ right: 32 }}>
                <div className={styles.backTop}>
                  <VerticalAlignTopOutlined />
                </div>
              </BackTop>
            </div>
          </div>
        </div>
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
