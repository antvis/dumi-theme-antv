import React, { useContext } from 'react';
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
const Playground: React.FC<PlaygroundProps> = ({ rid, path, ratio = 0.62, height = 400 }) => {
  /** 示例页面的元数据信息 */
  const { meta }: any = useContext(ThemeAntVContext);
  const { exampleTopics } = meta;
  // '/case/area/demo/area5.ts'
  const [_, topic, example, demo] = path.match(/\/([\w-]+)\/([\w-]+)\/demo\/([\w-]+)/i);

  return (
    <div className={styles.container} style={{ height }}>
      <CodeRunner exampleTopics={exampleTopics} topic={topic} example={example} demo={demo} />
    </div>
  );
};

export default Playground;
