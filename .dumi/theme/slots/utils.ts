import { groupBy } from 'lodash-es';
import i18n from 'i18next';

type Status = 'responded' | 'error' | 'timeout';

export const ping = (callback: (status: Status) => void): NodeJS.Timeout => {
  const url =
    'https://private-a' +
    'lipay' +
    'objects.alip' +
    'ay.com/alip' +
    'ay-rmsdeploy-image/rmsportal/RKuAiriJqrUhyqW.png';
  const img = new Image();
  let done = false;
  const finish = (status: Status) => {
    if (!done) {
      done = true;
      img.src = '';
      callback(status);
    }
  };
  img.onload = () => finish('responded');
  img.onerror = () => finish('error');
  img.src = url;
  return setTimeout(() => finish('timeout'), 1500);
};

export const getChinaMirrorHost = (host?: string): string => {
  const hostString = typeof host === 'undefined' ? window.location.host : host;
  // antv.vision => antv.gitee.io
  if (hostString === 'antv.vision') {
    return 'antv.gitee.io';
  }
  // g2plot.antv.vision => antv-g2plot.gitee.io
  const match = hostString.match(/(.*)\.antv\.vision/);
  if (match && match[1]) {
    return `antv-${match[1]}.gitee.io`;
  }
  return hostString;
};

export function getGithubSourceUrl(githubUrl: string, relativePath: string, prefix: string = 'examples'): string {
  // https://github.com/antvis/x6/tree/master/packages/x6-sites
  if (githubUrl.includes('/tree/master/')) {
    return `${githubUrl.replace(
      '/tree/master/',
      '/edit/master/',
    )}/${prefix}/${relativePath}`;
  }
  return `${githubUrl}/edit/master/${prefix}/${relativePath}`;
}


export const getAllDemosInCategory = (allDemos: any[], lang: string) => {
  return groupBy(allDemos || [], (demo: any) => {
    if (!demo.postFrontmatter || !demo.postFrontmatter[lang]) {
      return 'OTHER';
    }
    return demo.postFrontmatter[lang].title;
  });
};

export const getSortedCategories = (allDemosInCategory: any) => {
  return Object.keys(allDemosInCategory).sort(
    (a: string, b: string) => {
      if (a === 'OTHER') {
        return -1;
      }
      if (b === 'OTHER') {
        return 1;
      }
      return (
        allDemosInCategory[a][0].postFrontmatter[i18n.language].order -
        allDemosInCategory[b][0].postFrontmatter[i18n.language].order
      );
    },
  );
};

const getMenuItemLocaleKey = (slug = '') => {
  const slugPieces = slug.split('/');
  return slugPieces
    .slice(slugPieces.indexOf('examples') + 1)
    .filter((key) => key)
    .join('/');
};


const getExampleOrder = (options: {
  groupedEdgeKey: string;
  examples: any[];
  groupedEdges: {
    [key: string]: any[];
  };
}): number => {
  const { groupedEdgeKey, groupedEdges, examples } = options;

  const key = getMenuItemLocaleKey(groupedEdgeKey);
  if (examples.find((item) => item.slug === key)) {
    return (examples.findIndex((item) => item.slug === key) || 0) + 100;
  }
  if (!groupedEdges[groupedEdgeKey] && !groupedEdges[groupedEdgeKey].length) {
    return 0;
  }
  return groupedEdges[groupedEdgeKey][0].node.frontmatter.order || 0;
};

export const getGroupedEdges = (edges: any) => {
  return groupBy(
    edges,
    ({
       node: {
         fields: { slug: slugString },
       },
     }: any) => {
      // API.md and design.md
      if (slugString.endsWith('/API') || slugString.endsWith('/design')) {
        return slugString.split('/').slice(0, -2).join('/');
      }
      // index.md
      return slugString.split('/').slice(0, -1).join('/');
    },
  );
};

// 提取出筛选 和 排序的方法 好在获取treeData 的时候使用
export const getGroupedEdgesDataEdit = (examples: any, edges: any, local: string) => {
  const groupedEdges = getGroupedEdges(edges);
  return Object.keys(groupedEdges)
    .filter((key) => key.startsWith(`/${local}/`))
    .sort((a: string, b: string) => {
      const aOrder = getExampleOrder({
        groupedEdgeKey: a,
        examples,
        groupedEdges,
      });
      const bOrder = getExampleOrder({
        groupedEdgeKey: b,
        examples,
        groupedEdges,
      });
      return aOrder - bOrder;
    });
};

export const getTreeDataByExamplesAndEdges = (examples: any, edges: any, locale: string) => {
  return getGroupedEdgesDataEdit(examples, edges, locale).map((slugString) => {
    const menuItemLocaleKey = getMenuItemLocaleKey(slugString);
    const doc =
      examples.find((item: any) => item.slug === menuItemLocaleKey) || {};

    return {
      title: doc && doc.title ? doc.title[i18n.language] : menuItemLocaleKey,
      value: slugString,
      icon: doc.icon,
      children: getGroupedEdges(edges)[slugString].filter((edge) => {
        const {
          node: {
            fields: { slug },
          },
        } = edge;
        return !(slug.endsWith('/API') ||
          slug.endsWith('/design') ||
          slug.endsWith('/gallery'));
      }),
    };
  });
};
