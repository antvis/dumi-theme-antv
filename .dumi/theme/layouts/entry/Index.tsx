import React from 'react';
import { useSiteData } from 'dumi';
import { Header } from '../../slots/Header';
import { Detail } from '../../slots/Detail';
import { Features } from '../../slots/Features';
import { Cases } from '../../slots/Cases';
import { Companies } from '../../slots/Companies';
import { Footer } from '../../slots/Footer';

/**
 * Index 路由下的入口
 * - 获取数据
 * - 组合 slots 下的木偶组件
 */
export const Index = () => {
  const { themeConfig } = useSiteData();
  const {
    title, siteUrl, githubUrl, isAntVSite,
    showSearch, showGithubCorner, showGithubStars, showLanguageSwitcher, showWxQrcode, defaultLanguage, showAntVProductsCard,
    versions, ecosystems, navs,
    detail, news, companies, features, cases, className,
    style,
    id,
  } = themeConfig;

  const detailProps = {
    githubUrl,
    showGithubStars,
    news,
    ...detail,
  }

  const featuresProps = {
    title,
    features,
    className,
    style,
    id,
  }

  const casesProps = {
    cases, style, className
  }

  return (
    <>
      <Header />
      <Detail {...detailProps} />
      <Features {...featuresProps} />
      <Cases {...casesProps} />
      <Companies title="感谢信赖" companies={companies} />
      <Footer />
    </>
  );
};
