import { FormattedMessage, useSiteData } from 'dumi';
import { get, isArray, size } from 'lodash-es';
import React from 'react';
import SEO from '../../common/SEO';
import { Cases } from '../../slots/Cases';
import { Companies } from '../../slots/Companies';
import { Detail } from '../../slots/Detail';
import { Features } from '../../slots/Features';
import { Footer } from '../../slots/Footer';
import { Header } from '../../slots/Header';

/**
 * Index 路由下的入口
 * - 获取数据
 * - 组合 slots 下的木偶组件
 */
export const Index = () => {
  const { themeConfig } = useSiteData();
  const {
    title,
    githubUrl,
    isAntVSite,
    showGithubStars,
    detail,
    news,
    companies,
    features,
    cases,
    className,
    style,
    id,
  } = themeConfig;

  const detailProps = {
    githubUrl,
    showGithubStars,
    news,
    ...detail,
  };

  const featuresProps = {
    title: get(features, ['title']),
    features: isArray(features) ? features : get(features, ['cards'], []),
    className,
    style,
    id,
  };

  const casesProps = { cases, style, className };

  return (
    <>
      <SEO title={title} titleSuffix="AntV" />
      <Header />
      {size(detail) ? <Detail {...detailProps} /> : null}
      {size(featuresProps.features) ? <Features {...featuresProps} /> : null}
      {size(cases) ? <Cases {...casesProps} /> : null}
      {size(companies) ? (
        <Companies
          title={<FormattedMessage id={isAntVSite ? '2000+ 公司正在使用' : '感谢信赖'} />}
          companies={companies}
        />
      ) : null}
      <Footer />
    </>
  );
};
