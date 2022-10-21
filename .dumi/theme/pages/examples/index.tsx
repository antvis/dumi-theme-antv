import { useContext } from 'react';
import { BackTop, Layout as AntLayout } from 'antd';
import { Header } from '../../slots/Header';
import { Footer } from '../../slots/Footer';
import NavigatorBanner from '../../slots/Header/Products/NavigatorBanner';
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import { Article } from './components/Article';
import { LeftMenu } from './components/LeftMenu';
import { GalleryPageContent } from './components/GalleryPageContent';
import { usePrevAndNext } from '../../slots/hooks';
import { ThemeAntVContext } from '../../context';
import styles from './index.module.less';


/**
 * Examples 页面
 *
 * @author YuZhanglong <loveyzl1123@gmail.com>
 */
const Example = () => {
  /** 示例页面的元数据信息 */
  const metaData: any = useContext(ThemeAntVContext);

  const { allMarkdownRemark, site } = metaData.meta.result.data;
  const {
    siteMetadata: { examples = [] },
  } = site;

  const { exampleSections = {}, allDemos = [] } = metaData.meta.result.pageContext;

  const { edges = [] } = allMarkdownRemark;


  // Playground 部分，先注释
  // const currentPath = location.pathname.replace(/\/$/, '');
  // const isGalleryView = currentPath.includes('/examples/gallery');
  //
  // const { node: markdownRemark } =
  // edges.find((edge: any) => {
  //   const {
  //     fields: { slug },
  //   } = edge.node;
  //
  //   if (
  //     /\/examples\/.*\/API$/.test(currentPath) ||
  //     /\/examples\/.*\/design$/.test(currentPath)
  //   ) {
  //     return currentPath.indexOf(slug) >= 0;
  //   }
  //   return (
  //     currentPath === slug ||
  //     currentPath.endsWith(slug)
  //   );
  // }) || {};


  const [prev, next] = usePrevAndNext();


  return (
    <>
      <Header isHomePage={false} />
      <AntLayout
        hasSider
        className={styles.layout}>
        <LeftMenu edges={edges} examples={examples} />
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
      <Footer />
    </>
  );
};

export default Example;
