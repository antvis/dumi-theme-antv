
import * as G2 from '@antv/g2';

/**
 * 增加自己的全局变量，用于 DEMO 中的依赖，以 G2 为例
 */
if (window) {
  (window as any).g2 = G2;
}
