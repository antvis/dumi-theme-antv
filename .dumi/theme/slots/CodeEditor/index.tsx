import React from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Result, Button } from 'antd';
import { Link } from 'dumi';

import { Toolbar, EDITOR_TABS } from '../PlayGround/Toolbar';

import styles from './index.module.less';

export type CodeEditorProps = {
  /**
   * 标题
   */
  title?: string;
  /**
   * 输入的源码
   */
  source: string;
  /**
   * 经过编译之后的源码，包括 typescript 的处理。用于浏览器执行
   */
  babeledSource: string;
  /**
   * 相对地址
   */
  relativePath?: string;
  /**
   * 初始化
   */
  onReady: () => void;
  /**
   * 销毁
   */
  onDestroy: () => void;
  /**
   * 工具条点击的时候
   */
  onToolbarClick: (type: string) => void;
  /**
   * 执行出错的时候，回调，方便上层做显示
   */
  onError: (e: any) => void;
}

export const CodeEditor = () => {
  return (
     <div className={styles.editor}>
      
    </div>
  );
}
