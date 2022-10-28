import React from 'react';
import { useContext } from 'react';
import { BackTop, Layout as AntLayout } from 'antd';
import { Header } from '../../slots/Header';
import { Footer } from '../../slots/Footer';
import NavigatorBanner from '../../slots/Header/Products/NavigatorBanner';
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import { Article } from './components/Article';
import { ExampleTopicMenu } from './components/ExampleTopicMenu';
import { GalleryPageContent } from './components/GalleryPageContent';
import { usePrevAndNext } from '../../slots/hooks';
import { ThemeAntVContext } from '../../context';
import styles from './index.module.less';
import React from 'react';


/**
 * Examples 页面
 *
 * @author YuZhanglong <loveyzl1123@gmail.com>
 */
const Example = () => {
  /** 示例页面的元数据信息 */
  const metaData: any = useContext(ThemeAntVContext);

  const exampleTopics: ExamplesPage.ExampleTopic[] = metaData.meta.exampleTopics;

  const { exampleSections = {}, allDemos = [] } = metaData.meta.result.pageContext;

  const [prev, next] = usePrevAndNext();

  return (
    <>
      <Header isHomePage={false} />
      <AntLayout
        hasSider
        className={styles.layout}>
        <ExampleTopicMenu exampleTopics={exampleTopics} />
        <Article className={styles.markdown}>
          <div className={styles.main} style={{ width: '100%' }}>
            <GalleryPageContent allDemos={allDemos} exampleSections={exampleSections} />
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
