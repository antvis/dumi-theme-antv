import React from 'react';
import { Result } from 'antd';
import { useTranslation } from 'react-i18next';

import styles from './index.module.less';

export type ExamplePreviewProps = {
  error?: any;
}

/**
 * DEMO 预览页面的预览
 */
export const ExamplePreview: React.FC<ExamplePreviewProps> = ({ error }) => {
  const { i18n, t } = useTranslation();
  return (
    <div className={styles.preview}>
      <div id="container" className={styles.container}>
        {/** 这里是 DEMO 运行需要的 dom 容器  */}
      </div>
      {
        error ?
          <Result
            className={styles.result}
            status="error"
            title={t('演示代码报错，请检查')}
            subTitle={<pre>{error && (error as any).message}</pre>}
          /> : null
      }
    </div>
  )
}
