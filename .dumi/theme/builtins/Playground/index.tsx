import React from 'react';
import { noop } from 'lodash-es';
import SplitPane from 'react-split-pane';
import { CodePreview } from '../../slots/CodePreview';
import { CodeEditor } from '../../slots/CodeEditor';

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
const Playground: React.FC<PlaygroundProps> = ({ rid, path, ratio = 0.62, height = 400 }) => {
  // @todo 逍为
  /**
   * 根据 context 传过来的所有案例，然后用 path 去匹配到对应的案例，拿到案例 demo 的信息，用于下面的渲染
   */

  return (
    <div className={styles.container} style={{ height }}>
      {/** @ts-ignore */}
      <SplitPane split="vertical" defaultSize={`${ratio * 100}%`} minSize={100}>
        {/** @todo 逍为，和编辑器联动 */}
        <CodePreview error={new Error('abc')} />
        {/** @todo 逍为，获取源码内容和文件 */}
        <CodeEditor source="" babeledSource="" relativePath={path} replaceId={rid} onError={noop} onFullscreen={noop} onDestroy={noop} onReady={noop} />
      </SplitPane>
    </div>
  );
};

export default Playground;