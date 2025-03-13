import { useIntl, useSiteData } from 'dumi';
import { get, isArray, size } from 'lodash-es';
import React from 'react';
import CommonHelmet from '../../common/CommonHelmet';
import { ic } from '../../slots/hooks';
import { Cases } from './components/Cases';
import { Companies } from './components/Companies';
import { Detail } from './components/Detail';
import { Features } from './components/Features';

const Index = () => {
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
  const { formatMessage } = useIntl();

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
      <CommonHelmet title={ic(title)} titleSuffix="AntV" />
      {size(detail) ? <Detail {...detailProps} /> : null}
      {size(featuresProps.features) ? <Features {...featuresProps} /> : null}
      {size(cases) ? <Cases {...casesProps} /> : null}
      {size(companies) ? (
        <Companies
          title={formatMessage({ id: isAntVSite ? '2000+ 公司正在使用' : '感谢信赖' })}
          companies={companies}
        />
      ) : null}
    </>
  );
};

export default Index;
