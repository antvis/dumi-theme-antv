import { useSiteData } from 'dumi';
import { get } from 'lodash-es';
import React, { useContext } from 'react';
import { ErrorBoundary } from 'react-error-boundary'
import { ThemeAntVContext } from '../../context';
import { CodeRunner } from '../../slots/CodeRunner';

import styles from './index.module.less';

export type PlaygroundProps = {
  /**
   * 代码示例的地址
   */
  path: string;
  /**
   * 渲染容器的 id，默认为 container
   */
  rid?: string;
  /**
   * 预览区、代码区的宽度占比，默认为 0.62
   */
  ratio?: number;
  /**
   * 容器的高度，默认为 400px
   */
  height?: number;
}

/**
 * Markdown 标签插件 Playground
 */
const Playground: React.FC<PlaygroundProps> = ({ rid, path, ratio, height = 400 }) => {
  /** 示例页面的元数据信息 */
  const { meta }: any = useContext(ThemeAntVContext);
  const { exampleTopics } = meta;
  // 'case/area/demo/area5.ts'
  const [_, topic, example, demo] = path.match(/([\w-]+)\/([\w-]+)\/demo\/([\w-]+)/i) as string[];

  const themeConfig = useSiteData();
  const defaultSize = get(themeConfig, 'editor.playgroundSize', 0.38);

  return (
    <div className={styles.container} style={{ height }}>
      <CodeRunner exampleTopics={exampleTopics} topic={topic} example={example} demo={demo} size={ratio || defaultSize} />
    </div>
  );
};

function ErrorFallback({error, resetErrorBoundary}) {
  console.log(error);
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  )
}

export default ((props: PlaygroundProps) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Playground {...props} />
    </ErrorBoundary>
  );
}) as React.FC<PlaygroundProps>;
