import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from 'antd';
import { groupBy, noop } from 'lodash-es';
import SplitPane from 'react-split-pane';
import { Header } from '../../slots/Header';
import { ExampleSider, PlayGroundItemProps, TreeItem } from '../../slots/ExampleSider';
import { CodePreview } from '../../slots/CodePreview';
import { CodeEditor } from '../../slots/CodeEditor';
import { CodeHeader } from '../../slots/CodePreview/CodeHeader';

import styles from './index.module.less';
import { ThemeAntVContext } from '@/.dumi/theme/context';
import i18n from 'i18next';
import { getSortedCategories } from '@/.dumi/theme/slots/utils';

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

  const sortedCategories = getSortedCategories(allDemosInCategory);

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

  const getTreeData = () => {
    const result: TreeItem[] = [];
    sortedCategories.forEach((category: string) => {
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

    const newTreeData: TreeItem[] = [];
    // 扁平化 一级菜单中的数据， 示例有些并不是在第三层， 也有在第二层
    treeData.forEach((treeItem) => {
      const slugPieces = treeItem.value?.split('/');
      if (!slugPieces) return;
      if (slugPieces.length <= 3) {
        newTreeData.push(...treeItem.children);
      } else {
        newTreeData.push(treeItem);
      }
    });

    return transformNode(newTreeData, result);
  };


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
};

export default Example;
