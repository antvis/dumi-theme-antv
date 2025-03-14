import { Helmet, useLocale, useRouteMeta, useSiteData } from 'dumi';
import React, { useLayoutEffect } from 'react';

interface CommonHelmetProps {
  titleSuffix?: string;
  title?: string;
  description?: string;
  meta?: any[];
}

const CommonHelmet: React.FC<CommonHelmetProps> = ({
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
  const fullTitle = `${title} | ${titleSuffix || defaultTitle}`;

  const defaultMeta = [
    { name: `description`, content: description },

    // "og" 全称为 Open Graph，用于指定页面在社交媒体上的展示效果
    { property: `og:title`, content: title },
    { property: `og:description`, content: description },
    { property: `og:image`, content: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png' },
    { property: `og:type`, content: `website` },

    { name: `twitter:card`, content: `summary` },
    { name: `twitter:title`, content: title },
    { name: `twitter:description`, content: description },
    { property: `twitter:image`, content: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png' },
  ];

  useLayoutEffect(() => {
    // 直接设置 document.title 作为备份机制
    document.title = fullTitle;
  }, [fullTitle]);

  return <Helmet htmlAttributes={{ lang }} title={fullTitle} meta={[...defaultMeta, ...propMeta]} />;
};

export default CommonHelmet;
