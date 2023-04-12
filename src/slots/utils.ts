import { Status, TreeNode } from '../types';
import { icWithLocale } from './hooks';

export async function ping(): Promise<Status> {
  const timeout = new Promise<Status>((resolve) => {
    setTimeout(() => {
      resolve('timeout');
    }, 1500);
  });
  const url =
    'https://private-a' +
    'lipay' +
    'objects.alip' +
    'ay.com/alip' +
    'ay-rmsdeploy-image/rmsportal/RKuAiriJqrUhyqW.png';

  const network = fetch(url).then((resp) => resp.status === 200 ? 'responded' : 'error');

  return Promise.race([timeout, network]);
}

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

export function getGithubSourceURL(
  githubUrl: string,
  relativePath: string,
  prefix: string = 'examples',
): string {
  // https://github.com/antvis/x6/tree/master/packages/x6-sites
  if (githubUrl.includes('/tree/master/')) {
    return `${githubUrl.replace(
      '/tree/master/',
      '/edit/master/',
    )}/${prefix}/${relativePath}`;
  }
  return `${githubUrl}/edit/master/${prefix}/${relativePath}`;
}

export const filterTreeNode = (
  treeNode: TreeNode,
  keyValue: string,
  locale: string,
) => {
  if (treeNode.childrenKey && Array.isArray(treeNode[treeNode.childrenKey])) {
    const children = treeNode[treeNode.childrenKey] as TreeNode[];
    const filteredChildren = children.filter((child) => {
      const c = filterTreeNode(child, keyValue, locale);
      return c !== null;
    });

    if (filteredChildren.length > 0) {
      treeNode[treeNode.childrenKey] = [...filteredChildren];
      return treeNode;
    }
  }

  const title = icWithLocale(treeNode.title, locale) || '';
  const matchFields = [title, treeNode.id, treeNode.filename];
  
  const isCurrentTreeNodeMatched = 
    matchFields.some(f => (f ? f.toLowerCase() : '').includes(keyValue ? keyValue.toLowerCase() : ''));

  // 当前节点自身匹配，那么其孩子直接匹配，可以直接返回当前节点
  if (isCurrentTreeNodeMatched) {
    return treeNode;
  }

  return null;
};
