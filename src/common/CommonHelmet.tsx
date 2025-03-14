import { Helmet, useLocale, useRouteMeta, useSiteData } from 'dumi';
import React, { useEffect, useMemo } from 'react';

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

  const title = useMemo(() => propTitle || meta.frontmatter.title, [propTitle, meta.frontmatter.title]);

  const description = useMemo(
    () => propDescription || meta.frontmatter.description || defaultDescription,
    [propDescription, meta.frontmatter.description, defaultDescription],
  );

  const fullTitle = useMemo(() => `${title} | ${titleSuffix || defaultTitle}`, [title, titleSuffix, defaultTitle]);

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

  useEffect(() => {
    // 延迟 document.title 设置标题作为备份机制
    // 这确保在路由快速切换或异步组件加载时标题仍能正确设置
    const timer = setTimeout(() => {
      document.title = fullTitle;
    }, 100);

    return () => clearTimeout(timer);
  }, [fullTitle]);

  return <Helmet htmlAttributes={{ lang }} title={fullTitle} meta={[...defaultMeta, ...propMeta]} />;
};

export default CommonHelmet;
