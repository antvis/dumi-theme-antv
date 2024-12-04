import { each } from 'lodash-es';
import React from 'react';

const tuple = <T extends string[]>(...args: T) => args;
const Categories = tuple('basic', 'extension', 'ecology');
const Link = tuple('home', 'example', 'api');

export interface ProductCategory {
  type: (typeof CATEGORY_TYPE)[number];
  name: string;
  products: ProductType[];
}
export interface ProductItem {
  title: string;
  icon?: React.ReactNode;
  slogan?: string;
  description: string;
  category: (typeof Categories)[number];
  links?: Array<{
    icon?: React.ReactNode;
    title: React.ReactNode;
    url?: string;
    openExternal?: boolean;
  }>;
}

const ANTV_DOMAIN = 'antv.vision';

export type ValuesOf<T extends any[]> = T[number];

const CATEGORY_TYPE = tuple('basic', 'extension', 'mobile', 'ecology');
export const CATEGORIES: Array<ProductCategory> = [
  { type: 'basic', name: '标准版基础产品', products: [] },
  { type: 'extension', name: '标准版扩展产品', products: [] },
  { type: 'mobile', name: '移动定制（F版）产品', products: [] },
  { type: 'ecology', name: '周边生态', products: [] },
];

export type ProductType = {
  links: {
    /** 产品首页 */
    readonly home?: { url: string; title?: string };
    /** 图表示例 */
    readonly example?: { url: string; title?: string };
    /** 使用文档 */
    readonly api?: { url: string; title?: string };
  };
  [k: string]: any;
};

export function getNewProducts({
  language,
  isChinaMirrorHost,
}: {
  language: 'zh' | 'en';
  isChinaMirrorHost: boolean;
}): Promise<ProductType[]> {
  // 如需要修改产品信息，请到 https://yuyan.antfin-inc.com/antv/site-data/sprints 修改区块内容
  return fetch(
    'https://assets.antv.antgroup.com/antv/products.json', // 生产环境
    // 'https://site-data-pre.alipay.com/antv/products.json', // 预发测试
  )
    .then((res) => res.json())
    .then((products: ProductType[]) => {
      return products
        .filter((d) => d.lang === language)
        .map((d) => {
          const links = typeof d.links === 'string' ? JSON.parse(d.links) : { ...d.links };
          const newLinks: any = {};

          each(links, (value, k: string) => {
            let actualUrl = value?.url || '';
            if (isChinaMirrorHost) {
              // g2plot.antv.vision => antv-g2plot.gitee.io
              const match = actualUrl.match(/([http|https]):\/\/(.*)\.antv\.vision/);
              if (match && match[2]) {
                actualUrl = actualUrl.replace(`${match[2]}.antv.vision`, `antv-${match[2]}.gitee.io`);
              }
            }
            newLinks[k] = { ...value, url: actualUrl };
          });
          return { ...d, links: newLinks };
        });
    });
}
