import React, { useEffect, useRef, useState } from 'react';
import { Result } from 'antd';
import { FormattedMessage } from 'dumi';

import styles from './index.module.less';
import { Runner } from './runner';

export type CodePreviewProps = {
  /**
   * 源码
   */
  source: string;
  /**
   * 在文档中预览
   */
  isPlayground: boolean;
  /**
   * id
   */
  exampleId: string;
  /**
   * 预览页面头部组件，用于显示 demo 名称，一些操作栏等
   */
  header?: React.ReactElement;
  /**
   * 需要展示的编译错误信息
   */
  compileError: any;
}

function getErrorMessage(e): string {
  return (e.reason ? e.reason :
          e.message ? e.message : e).toString();
}


/**
 * DEMO 预览页面的预览，主要包含有：
 * 1. 一些 header 菜单
 * 2. 错误预览
 */
export const CodePreview: React.FC<CodePreviewProps> = ({ isPlayground, exampleId, source, header, compileError }) => {
  const iframe = useRef(null);

  const [execError, setExecError] = useState(null);

  let runner = useRef(null);
  useEffect(() => {
    runner.current = new Runner(iframe.current);
  }, []);

  useEffect(() => {
    setExecError(null);
    runner.current.onerror((e) => {
      console.log('execute error', e); // for debugger
      setExecError(e);
    });

    runner.current.html(`<div id="container"></div>`);
    runner.current.css(`
      body {
        margin: 0;
        padding: 0;
      }
      #container {
        width: 100%;
        height: 100%;
      }
    `);
    runner.current.dependencies((window as any).__iframeDependencies);
    runner.current.exec(source);
  }, [source]);

  return (
    <div className={styles.preview}>
      {
        isPlayground ? null : <div className={styles.header}>{ header }</div>
      }
      <div className={styles.content}>
        <iframe style={{
          overflow: 'hidden',
          width: '100%',
          height: '100%',
        }} ref={iframe} id={`playgroundScriptContainer_${exampleId}`} width="100%" height="200%" className={styles.playgroundScriptContainer}>
          {/** 这里是 DEMO 运行需要的 dom 容器  */}
          {/** 这里是 script 标签运行的环境  */}
        </iframe>
        {
          (compileError || execError) ?
            <Result
              className={styles.result}
              status="error"
              title={<FormattedMessage id="演示代码报错，请检查" />}
              subTitle={<pre>{getErrorMessage(compileError || execError)}</pre>}
            /> : null
        }
      </div>
    </div>
  )
}
