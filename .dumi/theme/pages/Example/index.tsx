import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from 'antd';
import { useLocale } from 'dumi';
import { Header } from '../../slots/Header';
import { ExampleSider, PlayGroundItemProps, TreeItem } from '../../slots/ExampleSider';
import { CodeRunner } from '../../slots/CodeRunner';
import { ThemeAntVContext } from '../../context';

import styles from './index.module.less';
import { getDemoInfo } from '@/.dumi/theme/slots/CodeRunner/utils';

const { Sider, Content } = Layout;

type ExampleParams = {
  /**
   * 多语言
   */
  language: 'zh' | 'en';
  /**
   * Example 的分类
   */
  topic: string;
  /**
   * Example 的名称
   */
  example: string;
}

/**
 * 具体单个案例的页面
 */
const Example: React.FC = () => {
  const { language = 'zh', topic, example } = useParams<ExampleParams>();
  console.log(topic, example);

  /** 示例页面的元数据信息 */
  const metaData: any = useContext(ThemeAntVContext);
  const locale = useLocale();

  const exampleTopics: ExamplesPage.ExampleTopic[] = metaData.meta.exampleTopics;
  const demo = location.hash.slice(1);

  const [currentDemo, setCurrentDemo] = useState<ExamplesPage.Demo>();


  useEffect(() => {
    if (topic && example && demo) {
      const targetDemoInfo = getDemoInfo(exampleTopics, topic, example, demo);
      setCurrentDemo(targetDemoInfo);
    }
  }, []);

  // 提取出来获取 唯一value值的 方法
  const getPath = (item: PlayGroundItemProps) => {
    if (!item) {
      // @todo 怀策
      // debugger
    }
    const demoSlug = item.relativePath?.replace(
      /\/demo\/(.*)\..*/,
      (_: string, filename: string) => {
        return `#${filename}`;
      },
    );
    return `/${locale.id}/examples/${demoSlug}`;
  };

  // 一级菜单，二级菜单 数据 treeData + 二级菜单，示例 数据 result 写成一个 一级，二级，示例的三层树结构 数据
  const transformNode = (data: TreeItem[], result: TreeItem[]): TreeItem[] => {
    return data.map((item) => {
      if (item.children && !item.node) {
        return { ...item, children: transformNode(item.children, result) };
      }
      const { frontmatter, fields } = item.node;
      return {
        ...frontmatter,
        // 提前给二级菜单的key值加入 特殊值 好辨别
        value: `secondaryKey-${fields?.slug}`,
        children: result.find(({ title: k }) => k === frontmatter.title)
          ?.children,
      };
    });
  };

  return (
    <div className={styles.example}>
      <Header isHomePage={false} />
      <Layout className={styles.container}>
        <Sider
          collapsedWidth={0}
          width={250}
          trigger={null}
          collapsible
          className={styles.sider}
          theme='light'
        >
          {currentDemo && <ExampleSider
            showExampleDemoTitle={true}
            currentDemo={currentDemo}
            onDemoClicked={(example) => {
              const { id: demoId, targetExample, targetTopic } = example;
              // eg: /zh/examples/case/area/#area1
              const newURL = `/${locale.id}/examples/${targetTopic?.id}/${targetExample?.id}/#${demoId}`;
              window.history.replaceState({}, '', newURL);
              setCurrentDemo(example);
            }}
            exampleTopics={exampleTopics}
          />}
        </Sider>
        <Content className={styles.content}>
          {topic && example && <CodeRunner exampleTopics={exampleTopics} topic={topic} example={example} demo={demo} />}
        </Content>
      </Layout>
    </div>
  );
};

export default Example;
