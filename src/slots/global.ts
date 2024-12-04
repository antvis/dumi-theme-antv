import insertCss from 'insert-css';
import * as _ from 'lodash-es';

// 挂载一些全局变量
if (window) {
  (window as any).lodash = _;
  (window as any).insertCss = insertCss;
}
