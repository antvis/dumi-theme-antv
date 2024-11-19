import { Helmet, useLocale, useRouteMeta, useSiteData } from 'dumi';
import React from 'react';

interface SEOProps {
  titleSuffix?: string;
  title?: string;
  description?: string;
  meta?: any[];
}

const SEO: React.FC<SEOProps> = ({
  titleSuffix,
  title: propTitle,
  description: propDescription,
  meta: propMeta = [],
}) => {
  const meta = useRouteMeta();
  const locale = useLocale();
  const lang = locale.id;
  const { themeConfig } = useSiteData();
  const { title: defaultTitle, defaultDescription } = themeConfig;

  const title = propTitle || meta.frontmatter.title;
  const description = propDescription || meta.frontmatter.description || defaultDescription;

  const defaultMeta = [
    { name: `description`, content: description },
    { property: `og:title`, content: title },
    { property: `og:description`, content: description },
    { property: `og:image`, content: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png' },
    { property: `og:type`, content: `website` },
    { name: `twitter:card`, content: `summary` },
    { name: `twitter:title`, content: title },
    { name: `twitter:description`, content: description },
    { property: `twitter:image`, content: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png' },
  ];

  return (
    <Helmet
      htmlAttributes={{ lang }}
      titleTemplate={`%s | ${titleSuffix || defaultTitle}`}
      title={title}
      meta={[...defaultMeta, ...propMeta]}
    />
  );
};

export default SEO;
