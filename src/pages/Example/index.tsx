import { Layout } from 'antd';
import { useLocale, useSiteData } from 'dumi';
import { every, find, get } from 'lodash-es';
import React, { lazy, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import InViewSuspense from '../../common/InViewSuspense';
import SEO from '../../common/SEO';
import { ThemeAntVContext } from '../../context';
import { store } from '../../model';
import { API } from '../../slots/API';
import { getDemoInfo } from '../../slots/CodeRunner/utils';
import { ExampleSider } from '../../slots/ExampleSider';
import { Header } from '../../slots/Header';
import { ExampleTopic } from '../../types';
import { CollapsedIcon } from './components/CollapsedIcon';
import styles from './index.module.less';

const { Sider, Content } = Layout;
const CodeRunner = lazy(() => import('../../slots/CodeRunner'));

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

  // TODO: 需要根据 locale 获取对应的 title
  const locale = useLocale();
  const exampleTitle = get(exampleDemo, ['title', locale.id]);

  const currentDemo = getDemoInfo(exampleTopics, topic, example, demo);

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
  };
};

/**
 * 具体单个案例的页面
 */
const Example: React.FC = () => {
  const state = useSnapshot(store);

  const navigate = useNavigate();

  const locale = useLocale();
  const { exampleTopics, exampleTitle, currentDemo, topic, example, demo } = useExampleMeta();

  const { themeConfig } = useSiteData();
  const showAPI = every([get(themeConfig, 'showAPIDoc'), topic, example], Boolean);

  if (!currentDemo) {
    return null;
  }

  return (
    <div className={styles.example}>
      <SEO title={exampleTitle} />
      <Header isHomePage={false} />
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
          <CollapsedIcon
            isCollapsed={state.hideMenu}
            onClick={(show) => {
              store.hideMenu = show;
            }}
            style={{ bottom: 0, right: state.hideMenu ? -24 : 0 }}
          />
        </Sider>
        {/*//FIXME: 待 ANTD bug 修复后，可以使用下面的代码*/}
        {/*<LeftOutlined
          className={styles.trigger}
          type={isCollapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={() => {

            setIsCollapsed(!isCollapsed);
          }}
          rotate={isCollapsed ? 180 : 0}
        />*/}
        <Content className={styles.content}>
          <InViewSuspense>
            <CodeRunner
              exampleTopics={exampleTopics}
              topic={topic}
              example={example}
              demo={demo}
              size={get(themeConfig, 'editor.size', 0.38)}
            />
          </InViewSuspense>
        </Content>
        {showAPI && (
          <API exampleTopics={exampleTopics} topic={topic} example={example} demo={demo} language={locale.id} />
        )}
      </Layout>
    </div>
  );
};

export default Example;
