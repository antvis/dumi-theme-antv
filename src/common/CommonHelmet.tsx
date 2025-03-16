import { Helmet, useLocale, useLocation, useRouteMeta, useSiteData } from 'dumi';
import { isEqual } from 'lodash-es';
import React, { useEffect } from 'react';

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
  meta: propMeta,
}) => {
  const meta = useRouteMeta();
  const locale = useLocale();
  const lang = locale.id;
  const { themeConfig } = useSiteData();
  const { title: defaultTitle, defaultDescription } = themeConfig;
  const location = useLocation();

  const helmetData = React.useMemo(() => {
    const title = propTitle || meta.frontmatter.title || '';
    const fullTitle = `${title} | ${titleSuffix || defaultTitle}`;

    const description = propDescription || meta.frontmatter.description || defaultDescription;

    const defaultMeta = [
      { name: `description`, content: description },

      // Open Graph 标签，指定页面在社交媒体上的展示效果
      { property: `og:title`, content: title },
      { property: `og:description`, content: description },
      { property: `og:image`, content: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png' },
      { property: `og:type`, content: `website` },

      // Twitter 卡片
      { name: `twitter:card`, content: `summary` },
      { name: `twitter:title`, content: title },
      { name: `twitter:description`, content: description },
      { property: `twitter:image`, content: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png' },
    ];

    return {
      title,
      description,
      fullTitle,
      defaultMeta,
      meta: [...defaultMeta, ...(propMeta || [])],
    };
  }, [
    propTitle,
    propDescription,
    meta.frontmatter.title,
    meta.frontmatter.description,
    defaultDescription,
    titleSuffix,
    defaultTitle,
    propMeta,
  ]);

  useEffect(() => {
    // 延迟 document.title 设置标题作为备份机制
    const timer = setTimeout(() => {
      document.title = helmetData.fullTitle;
    }, 100);

    return () => clearTimeout(timer);
  }, [helmetData.fullTitle]);

  return (
    <Helmet
      key={`helmet-${location.pathname}`}
      htmlAttributes={{ lang }}
      title={helmetData.fullTitle}
      meta={helmetData.meta}
    />
  );
};

export default React.memo(CommonHelmet, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.description === nextProps.description &&
    prevProps.titleSuffix === nextProps.titleSuffix &&
    isEqual(prevProps.meta, nextProps.meta)
  );
});
