import * as _ from 'lodash-es';
import insertCss from 'insert-css';

// 挂载一些全局变量
if (window) {
  (window as any).lodash = _;
  (window as any).insertCss = insertCss;
}
