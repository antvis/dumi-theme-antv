import { Layout } from 'antd';
import { useLocale, useSiteData } from 'dumi';
import { every, find, get } from 'lodash-es';
import React, { useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import InViewSuspense from '../../common/InViewSuspense';
import CommonHelmet from '../../common/CommonHelmet';
import { ThemeAntVContext } from '../../context';
import { store } from '../../model';
import { API } from '../../slots/API';
import CodeRunner from '../../slots/CodeRunner';
import { getDemoInfo } from '../../slots/CodeRunner/utils';
import { ExampleTopic } from '../../types';
import { CollapsedIcon } from './components/CollapsedIcon';
import styles from './index.module.less';

const { Sider, Content } = Layout;

const Header = React.lazy(() => import('../../slots/Header'));
const ExampleSider = React.lazy(() => import('../../slots/ExampleSider'));

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
};

/**
 * 解析 Example 页面的元数据
 */
const useExampleMeta = () => {
  /** 示例页面的元数据信息 */
  const metaData: any = useContext(ThemeAntVContext);
  const exampleTopics: ExampleTopic[] = metaData.meta.exampleTopics;

  const { topic, example } = useParams<ExampleParams>();
  const { hash } = useLocation();
  const examples = get(exampleTopics, ['0', 'examples']);
  const exampleDemo = find(examples, ({ id }) => id === example);
  // examples/case/id hash 为空，可以默认第一个 example 对应的 demo
  const demo = hash.slice(1) || get(exampleDemo, ['demos', '0', 'id']);

  const locale = useLocale();
  const exampleTitle = get(exampleDemo, ['title', locale.id]);

  const currentDemo = getDemoInfo(exampleTopics, topic, example, demo);
  const demoTitle = get(currentDemo, ['title', locale.id]);

  return {
    // all example topics
    exampleTopics,
    // topic id
    topic,
    // example id
    example,
    // example title
    exampleTitle,
    // demo id
    demo,
    // current demo info
    currentDemo,
    // demo title
    demoTitle,
  };
};

/**
 * 具体单个案例的页面
 */
const Example: React.FC = () => {
  const state = useSnapshot(store);

  const navigate = useNavigate();

  const locale = useLocale();
  const { exampleTopics, exampleTitle, currentDemo, topic, example, demo, demoTitle } = useExampleMeta();

  const { themeConfig } = useSiteData();
  const showAPI = every([get(themeConfig, 'showAPIDoc'), topic, example], Boolean);

  if (!currentDemo) {
    return null;
  }

  return (
    <div className={styles.example}>
      <CommonHelmet title={exampleTitle} description={demoTitle} />

      <InViewSuspense>
        <Header isHomePage={false} />
      </InViewSuspense>

      <Layout className={styles.container}>
        <Sider
          collapsedWidth={0}
          width={250}
          trigger={null}
          collapsible
          collapsed={state.hideMenu}
          className={styles.menuSider}
          theme="light"
        >
          <InViewSuspense>
            <ExampleSider
              showExampleDemoTitle={true}
              currentDemo={currentDemo}
              onDemoClicked={(example) => {
                const { id: demoId, targetExample, targetTopic } = example;
                // eg: /zh/examples/case/area/#area1
                const newURL = `/${locale.id}/examples/${targetTopic?.id}/${targetExample?.id}/#${demoId}`;
                navigate(newURL);
              }}
              exampleTopics={exampleTopics}
            />
          </InViewSuspense>

          <CollapsedIcon
            isCollapsed={state.hideMenu}
            onClick={(show) => {
              store.hideMenu = show;
            }}
            style={{ bottom: 0, right: state.hideMenu ? -24 : 0 }}
          />
        </Sider>

        <Content className={styles.content}>
          <CodeRunner
            exampleTopics={exampleTopics}
            topic={topic}
            example={example}
            demo={demo}
            size={get(themeConfig, 'editor.size', 0.38)}
          />
        </Content>

        {showAPI && (
          <API exampleTopics={exampleTopics} topic={topic} example={example} demo={demo} language={locale.id} />
        )}
      </Layout>
    </div>
  );
};

export default Example;
