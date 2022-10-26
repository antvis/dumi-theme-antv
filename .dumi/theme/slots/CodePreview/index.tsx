import React from 'react';
import { Result } from 'antd';

import { useT } from '../hooks';

import styles from './index.module.less';


export type CodePreviewProps = {
  /**
   * 预览页面头部组件，用于显示 demo 名称，一些操作栏等
   */
  header?: React.ReactElement;
  /**
   * 需要展示的错误信息
   */
  error: any;
}

/**
 * DEMO 预览页面的预览，主要包含有：
 * 1. 一些 header 菜单
 * 2. 错误预览
 */
export const CodePreview: React.FC<CodePreviewProps> = ({ header, error }) => {
  return (
    <div className={styles.preview}>
      <div className={styles.header}>{ header }</div>
      <div className={styles.content}>
        <div id="container" className={styles.container}>
          {/** 这里是 DEMO 运行需要的 dom 容器  */}
        </div>
        {
          error ?
            <Result
              className={styles.result}
              status="error"
              title={useT('演示代码报错，请检查')}
              subTitle={<pre>{error && (error as any).message}</pre>}
            /> : null
        }
      </div>
    </div>
  )
}
