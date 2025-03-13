import { VerticalAlignTopOutlined } from '@ant-design/icons';
import { Layout as AntLayout, BackTop } from 'antd';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InViewSuspense from '../../common/InViewSuspense';
import SEO from '../../common/SEO';
import { ThemeAntVContext } from '../../context';
import useLocale, { type LocaleMap } from '../../hooks/useLocale';
import { getPathname } from '../../slots/utils';
import { ExampleTopic } from '../../types';
import { Article } from './components/Article';
import ExampleTopicMenu from './components/ExampleTopicMenu';
import { GalleryPageContent } from './components/GalleryPageContent';
import styles from './index.module.less';

const Header = React.lazy(() => import('../../slots/Header'));
const Footer = React.lazy(() => import('../../slots/Footer'));

const locales: LocaleMap = {
  zh: {
    title: '所有图表',
  },
  en: {
    title: 'Gallery',
  },
};

/**
 * Examples 页面
 */
const Example = () => {
  const nav = useNavigate();
  const [locale] = useLocale(locales);

  /** 示例页面的元数据信息 */
  const metaData: any = useContext(ThemeAntVContext);

  const exampleTopics: ExampleTopic[] = metaData.meta.exampleTopics;

  // 为 zh 做兜底
  useEffect(() => {
    const p = getPathname();
    if (p.includes('/zh/')) {
      nav(p.replace('/zh/', '/'));
    }
  }, []);

  return (
    <>
      <SEO title={locale.title} />
      <InViewSuspense>
        <Header isHomePage={false} />
      </InViewSuspense>
      <AntLayout hasSider className={styles.layout}>
        <InViewSuspense>
          <ExampleTopicMenu exampleTopics={exampleTopics} />
        </InViewSuspense>

        <Article className={styles.markdown}>
          <div className={styles.main} style={{ width: '100%' }}>
            <GalleryPageContent exampleTopics={exampleTopics} />

            <BackTop style={{ right: 24 }}>
              <div className={styles.backTop}>
                <VerticalAlignTopOutlined />
              </div>
            </BackTop>
          </div>
        </Article>
      </AntLayout>

      <InViewSuspense>
        <Footer isDynamicFooter={true} />
      </InViewSuspense>
    </>
  );
};

export default Example;
