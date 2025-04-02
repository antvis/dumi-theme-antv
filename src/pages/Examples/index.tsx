import { VerticalAlignTopOutlined } from '@ant-design/icons';
import { FloatButton, Layout as AntLayout } from 'antd';
import React, { lazy, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommonHelmet from '../../common/CommonHelmet';
import { ThemeAntVContext } from '../../context';
import useLocale, { type LocaleMap } from '../../hooks/useLocale';
import Footer from '../../slots/Footer';
import Header from '../../slots/Header';
import { ExampleTopic } from '../../types';
import { Article } from './components/Article';
import { GalleryPageContent } from './components/GalleryPageContent';
import styles from './index.module.less';

const ExampleTopicMenu = lazy(() => import('./components/ExampleTopicMenu'));

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
const Examples = () => {
  const nav = useNavigate();
  const [locale] = useLocale(locales);

  /** 示例页面的元数据信息 */
  const metaData: any = useContext(ThemeAntVContext);

  const exampleTopics: ExampleTopic[] = metaData.meta.exampleTopics;

  // 为 zh 做兜底
  useEffect(() => {
    const p = window.location.pathname;
    if (p.includes('/zh/')) {
      nav(p.replace('/zh/', '/'));
    }
  }, []);

  return (
    <>
      <CommonHelmet title={locale.title} />

      <Header isHomePage={false} />

      <AntLayout hasSider className={styles.layout}>
        <ExampleTopicMenu exampleTopics={exampleTopics} />

        <Article className={styles.markdown}>
          <div className={styles.main} style={{ width: '100%' }}>
            <GalleryPageContent exampleTopics={exampleTopics} />

            <FloatButton.BackTop style={{ right: 24 }}>
              <div className={styles.backTop}>
                <VerticalAlignTopOutlined />
              </div>
            </FloatButton.BackTop>
          </div>
        </Article>
      </AntLayout>

      <Footer isDynamicFooter={true} />
    </>
  );
};

export default Examples;
