import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from 'antd';
import SplitPane from 'react-split-pane';
import { Header } from '../../slots/Header';
import { ExampleSider } from '../../slots/ExampleSider';
import { CodePreview } from '../../slots/CodePreview';
import { CodeEditor } from '../../slots/CodeEditor';
import { CodeHeader } from '../../slots/CodePreview/CodeHeader';

import styles from './index.module.less';


const { Sider, Content } = Layout;


type ExampleParams = {
  /**
   * 多语言
   */
  language: 'zh' | 'en';
  /**
   * Example 的分类
   */
  category: string;
  /**
   * Example 的名称
   */
  name: string;
}

/**
 * 具体单个案例的页面
 */
const Example: React.FC<{}> = () => {
  const { language, category, name } = useParams<ExampleParams>();

  // @todo 逍为
  const header = <CodeHeader title="hello world" relativePath="" githubUrl="" />

  return (
    <div className={styles.example}>
      <Header isHomePage={false} />
      <Layout className={styles.container}>
        <Sider
          collapsedWidth={0}
          width={250} // 多长好不晓得，250 差不多
          trigger={null}
          collapsible
          className={styles.sider}
          theme="light"
        >
          <div className={styles.exampleList}>
            <ExampleSider />
          </div>
        </Sider>
        <Content className={styles.content}>
          {/** @ts-ignore */}
          <SplitPane split="vertical" defaultSize="50%" minSize={100}>
            {/** @todo 逍为，和编辑器联动 */}
            <CodePreview error={new Error('abc')} header={header} />
            {/** @todo 逍为，获取源码内容和文件 */}
            <CodeEditor source="" babeledSource="" onError={() => {}} onFullscreen={() => {}} onDestroy={() => {}} onReady={() => {}} />
          </SplitPane>
        </Content>
      </Layout>
    </div>
  );
};

export default Example;
