import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from 'antd';
import { groupBy, noop } from 'lodash-es';
import SplitPane from 'react-split-pane';
import { Header } from '../../slots/Header';
import { ExampleSider, TreeItem } from '../../slots/ExampleSider';
import { CodePreview } from '../../slots/CodePreview';
import { CodeEditor } from '../../slots/CodeEditor';
import { CodeHeader } from '../../slots/CodePreview/CodeHeader';

import styles from './index.module.less';
import { ThemeAntVContext } from '@/.dumi/theme/context';
import i18n from 'i18next';

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

  /** 示例页面的元数据信息 */
  const metaData: any = useContext(ThemeAntVContext);

  const { allDemos } = metaData.meta.result.pageContext;

  // 获取 demo 的 Category 分类
  const getDemoCategory = (demo: any, lang = i18n.language) => {
    if (!demo.postFrontmatter || !demo.postFrontmatter[lang]) {
      return 'OTHER';
    }
    return demo.postFrontmatter[lang].title;
  };

  const allDemosInCategory = groupBy(allDemos || [], getDemoCategory);

  const Categories = Object.keys(allDemosInCategory).sort(
    (a: string, b: string) => {
      if (a === 'OTHER') {
        return -1;
      }
      if (b === 'OTHER') {
        return 1;
      }
      return (
        allDemosInCategory[a][0].postFrontmatter[i18n.language].order -
        allDemosInCategory[b][0].postFrontmatter[i18n.language].order
      );
    },
  );


  // 提取出来获取 唯一value值的 方法
  const getPath = (item: PlayGroundItemProps) => {
    const demoSlug = item.relativePath?.replace(
      /\/demo\/(.*)\..*/,
      (_: string, filename: string) => {
        return `#${filename}`;
      },
    );
    return `/${i18n.language}/examples/${demoSlug}`;
  };

  const getTreeData = () => {
    const result: TreeItem[] = [];
    categories.forEach((category: string) => {
      const root: TreeItem = {
        title: category,
        value: '',
        children: [],
      };

      allDemos[category].forEach((item: PlayGroundItemProps, index: number) => {
        const path = getPath(item);
        if (index === 0) {
          root.value = `root::${path}`;
        }
        const child = {
          ...item, // 需要里面的 各种数据
          title:
            typeof item.title === 'object'
              ? item.title[i18n.language]
              : item.title || item?.filename,
          value: path,
        };
        root.children.push(child);
      });

      result.push(root);
    });

    // @todo 逍为
    const header = <CodeHeader title='hello world' relativePath='a.ts' githubUrl='' />;

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
            theme='light'
          >
            <div className={styles.exampleList}>
              <ExampleSider
                showExampleDemoTitle={showExampleDemoTitle}
                getPath={getPath}
                currentExample={currentExample}
                updateCurrentExample={updateCurrentExample}
                treeData={getTreeData()} />
            </div>
          </Sider>
          <Content className={styles.content}>
            {/** @ts-ignore */}
            <SplitPane split='vertical' defaultSize='50%' minSize={100}>
              {/** @todo 逍为，和编辑器联动 */}
              <CodePreview error={new Error('abc')} header={header} />
              {/** @todo 逍为，获取源码内容和文件 */}
              <CodeEditor source='' babeledSource='' relativePath='a.ts' onError={noop} onFullscreen={noop}
                          onDestroy={noop} onReady={noop} />
            </SplitPane>
          </Content>
        </Layout>
      </div>
    );
  }
}

  export default Example;
