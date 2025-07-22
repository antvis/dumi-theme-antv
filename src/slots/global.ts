import insertCss from 'insert-css';
import * as _ from 'lodash-es';
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { safeWindow } from '../utils/env';

safeWindow((window) => {
  // 挂载一些全局变量
  (window as any).lodash = _;
  (window as any).insertCss = insertCss;
  (window as any).React = React;
  (window as any).ReactDOM = ReactDOM;
});
