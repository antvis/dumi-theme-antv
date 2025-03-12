import insertCss from 'insert-css';
import * as _ from 'lodash-es';
import { safeWindow } from '../utils/env';

safeWindow((window) => {
  // 挂载一些全局变量
  (window as any).lodash = _;
  (window as any).insertCss = insertCss;
});
