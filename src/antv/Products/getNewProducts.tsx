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
import { each } from "lodash";

export function getNewProducts({
  language,
  isChinaMirrorHost,
}: {
  language: "zh" | "en";
  isChinaMirrorHost: boolean;
}): Promise<ProductType[]> {
  // 如需要修改产品信息，请到 https://yuyan.antfin-inc.com/datavprod/antv-site-datas/schemas/site-products-h5data/console 修改区块内容
  return fetch(
    "https://render.alipay.com/p/h5data/antv-site-datas_site-products-h5data.json"
  )
    .then((res) => res.json())
    .then((products: ProductType[]) => {
      return products
        .filter((d) => d.lang === language)
        .map((d) => {
          const links =
            typeof d.links === "string" ? JSON.parse(d.links) : { ...d.links };
          const newLinks: any = {};

          each(links, (value, k: string) => {
            let actualUrl = value?.url || "";
            if (isChinaMirrorHost) {
              // g2plot.antv.vision => antv-g2plot.gitee.io
              const match = actualUrl.match(
                /([http|https]):\/\/(.*)\.antv\.vision/
              );
              if (match && match[2]) {
                actualUrl = actualUrl.replace(
                  `${match[2]}.antv.vision`,
                  `antv-${match[2]}.gitee.io`
                );
              }
            }
            newLinks[k] = { ...value, url: actualUrl };
          });
          return { ...d, links: newLinks };
        });
    });
}
