import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from 'antd';
import { noop } from 'lodash-es';
import SplitPane from 'react-split-pane';
import { Header } from '../../slots/Header';
import { ExampleSider } from '../../slots/ExampleSider';
import { CodePreview } from '../../slots/CodePreview';
import { CodeEditor } from '../../slots/CodeEditor';
import { CodeHeader } from '../../slots/CodePreview/CodeHeader';
import { ThemeAntVContext } from '../../context';
import { getExampleInfo } from './utils';

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
  /** 示例页面的元数据信息 */
  const metaData: any = useContext(ThemeAntVContext);

  const { language, category, name } = useParams<ExampleParams>();

  const {
    title,
    relativePath,
    source,
  } = getExampleInfo(metaData);

  const [error, setError] = useState<Error>();
  const [isFullScreen, setFullscreen] = useState<boolean>(false);

  // @todo 逍为
  const header = <CodeHeader title={title} relativePath={relativePath} githubUrl="" />

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
            <CodePreview error={error} header={header} />
            {/** @todo 逍为，获取源码内容和文件 */}
            <CodeEditor
              source={source}
              babeledSource={source}
              relativePath={relativePath}
              onError={setError}
              onFullscreen={setFullscreen}
              onDestroy={noop}
              onReady={noop}
            />
          </SplitPane>
        </Content>
      </Layout>
    </div>
  );
};

export default Example;
