import React from 'react';
import { useLocale, useSiteData } from 'dumi';
import { SEO } from '../../slots/SEO';
import { Header } from '../../slots/Header';
import { Detail } from '../../slots/Detail';
import { Features } from '../../slots/Features';
import { Cases } from '../../slots/Cases';
import { Companies } from '../../slots/Companies';
import { Footer } from '../../slots/Footer';
import { useT } from '../../slots/hooks';

/**
 * Index 路由下的入口
 * - 获取数据
 * - 组合 slots 下的木偶组件
 */
export const Index = () => {
  const locale = useLocale()
  const { themeConfig } = useSiteData();  
  const {
    title, siteUrl, githubUrl, isAntVSite,
    showSearch, showGithubCorner, showGithubStars, showLanguageSwitcher, showWxQrcode, defaultLanguage, showAntVProductsCard,
    versions, ecosystems, navs,
    detail, news, companies, features, cases, className,
    style,
    id
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

  const metaTitle = detailProps.title
  
  return (
    <>
      <SEO title={`${(metaTitle[locale.id])}`} titleSuffix="AntV" lang={locale.id} />
      <Header />
      <Detail { ...detailProps } />
      <Features { ...featuresProps } />
      <Cases { ...casesProps } />
      <Companies title={useT("感谢信赖")} companies={companies} />
      <Footer />
    </>
  );
};
