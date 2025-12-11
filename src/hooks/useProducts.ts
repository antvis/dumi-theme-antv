import { useQuery } from '@tanstack/react-query';
import {ProductType} from "../slots/Header/Products/getProducts";
import {getBaseSiteDataUrl} from "../utils/env";

export function getProducts(): Promise<ProductType[]> {
  // 如需要修改产品信息，请到 https://yuyan.antfin-inc.com/antv/site-data/sprints 修改区块内容
  return fetch(
    `${getBaseSiteDataUrl()}/antv/products.json`, // 生产环境
    // 'https://site-data-pre.alipay.com/antv/products.json', // 预发测试
  )
    .then((res) => res.json());
}


// 封装了 queryKey 和 fetcher 的自定义 Hook
export function useProducts() {
  return useQuery({
    queryKey: ['antv-products'],
    queryFn: getProducts,
    staleTime: 24 * 60 * 60 * 1000, // 一天内数据不会被认为是 "stale"，不会触发后台刷新
  });
}

export function getAntVConfig(): Promise<any> {
  // 如需要修改产品信息，请到 https://yuyan.antfin-inc.com/antv/site-data/sprints 修改区块内容
  return fetch(
    `${getBaseSiteDataUrl()}/antv/config.json`, // 生产环境
    // 'https://site-data-pre.alipay.com/antv/products.json', // 预发测试
  )
    .then((res) => res.json());
}


// 封装了 queryKey 和 fetcher 的自定义 Hook
export function useAntVConfig() {
  return useQuery({
    queryKey: ['antv-config'],
    queryFn: getAntVConfig,
    initialData: {
      "VisionSnapVersion": "3.5.12",
      "library": ["G2", "F2", "G6"]
    }
  });
}
