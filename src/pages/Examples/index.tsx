import React from 'react';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackTop, Layout as AntLayout } from 'antd';
import { useLocale } from 'dumi';
import { SEO } from '../../slots/SEO';
import { Header } from '../../slots/Header';
import { Footer } from '../../slots/Footer';
import NavigatorBanner from '../../slots/Header/Products/NavigatorBanner';
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import { Article } from './components/Article';
import { ExampleTopicMenu } from './components/ExampleTopicMenu';
import { GalleryPageContent } from './components/GalleryPageContent';
import { usePrevAndNext } from '../../slots/hooks';
import { ThemeAntVContext } from '../../context';
import { ExampleTopic } from '../../types';
import styles from './index.module.less';


/**
 * Examples 页面
 *
 * @author YuZhanglong <loveyzl1123@gmail.com>
 */
const Example = () => {
  const nav = useNavigate()
  const locale = useLocale()
  /** 示例页面的元数据信息 */
  const metaData: any = useContext(ThemeAntVContext);

  const exampleTopics: ExampleTopic[] = metaData.meta.exampleTopics;

  const [prev, next] = usePrevAndNext();

  const title = {
    zh: '所有图表',
    en: "Gallery"

  }
  // 为 zh 做兜底
  useEffect(() => {
    const p = window.location.pathname
    if (p.includes('/zh/')) {
      nav(p.replace('/zh/','/'))
  }
  },[])
  return (
    <>
      <SEO title={title[locale.id]} />
      <Header isHomePage={false} />
      <AntLayout
        hasSider
        className={styles.layout}>
        <ExampleTopicMenu exampleTopics={exampleTopics} />
        <Article className={styles.markdown}>
          <div className={styles.main} style={{ width: '100%' }}>
            <GalleryPageContent exampleTopics={exampleTopics} />
            <div>
              <NavigatorBanner type='prev' post={prev} />
              <NavigatorBanner type='next' post={next} />
            </div>
            <BackTop style={{ right: 32 }}>
              <div className={styles.backTop}>
                <VerticalAlignTopOutlined />
              </div>
            </BackTop>
          </div>
        </Article>
      </AntLayout>
      <Footer isDynamicFooter={true} />
    </>
  );
};

export default Example;
