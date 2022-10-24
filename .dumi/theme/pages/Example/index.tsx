import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout, PageHeader } from 'antd';
import SplitPane from 'react-split-pane';
import { Header } from '../../slots/Header';
import { ExampleSider } from '../../slots/ExampleSider';

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
const Example = () => {
  const { language, category, name } = useParams<ExampleParams>();
  return (
    <div className={styles.example}>
      <Header isHomePage={false} />
      <Layout className={styles.container}>
        <Sider
          collapsedWidth={0}
          width={188} // 多长好不晓得，250 差不多
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
          <SplitPane split="vertical" defaultSize="50%">
            <div className={styles.header}>
              <Layout className={styles.headerContainer}>
                <PageHeader className={styles.title} title="DEMO 标题 @怀策" />
                <Content className={styles.preview}>
                  <div className={styles.preview}>preview @逍为</div>
                </Content>
              </Layout>
            </div>
            <div className={styles.editor}>
              monaco editor @逍为
            </div>
          </SplitPane>
        </Content>
      </Layout>
    </div>
  );
};

export default Example;
