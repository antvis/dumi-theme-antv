import { useContext, useState } from 'react';
import { Layout as AntLayout } from 'antd';
import { ThemeAntVContext } from '@/.dumi/theme/context';
import { Header } from '../../slots/Header';
import { Footer } from '../../slots/Footer';
import { LeftMenu } from '@/.dumi/theme/pages/examples/left-menu';


/**
 * Examples 页面
 *
 * @author YuZhanglong <loveyzl1123@gmail.com>
 */
const Example = () => {
  /** 示例页面的元数据信息 */
  const metaData: any = useContext(ThemeAntVContext);


  const { allMarkdownRemark, site } = metaData.meta;
  const {
    siteMetadata: { examples = [], galleryMenuCloseAll = false },
  } = metaData.meta.site;

  const { edges = [] } = allMarkdownRemark;

  const currentPath = location.pathname.replace(/\/$/, '');

  const isGalleryView = currentPath.includes('/examples/gallery');

  console.log(isGalleryView);

  const { node: markdownRemark } =
  edges.find((edge: any) => {
    const {
      fields: { slug },
    } = edge.node;

    if (
      /\/examples\/.*\/API$/.test(currentPath) ||
      /\/examples\/.*\/design$/.test(currentPath)
    ) {
      return currentPath.indexOf(slug) >= 0;
    }
    return (
      currentPath === slug ||
      currentPath.endsWith(slug)
    );
  }) || {};


  return (
    <>
      <Header isHomePage={false} />
      <AntLayout>
        <LeftMenu edges={edges} examples={examples} />
      </AntLayout>
      <Footer />
    </>
  );
};

export default Example;
