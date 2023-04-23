import { Layout } from 'antd';
import { useLocale, useSiteData } from 'dumi';
import { get } from 'lodash-es';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ThemeAntVContext } from '../../context';
import { CodeRunner } from '../../slots/CodeRunner';
import { getDemoInfo } from '../../slots/CodeRunner/utils';
import { ExampleSider } from '../../slots/ExampleSider';
import { Header } from '../../slots/Header';
import { SEO } from '../../slots/SEO';
import { Demo, ExampleTopic } from '../../types';
import styles from './index.module.less';
import { getCurrentTitle } from './utils';

const { Sider, Content } = Layout;

type title = {
  [key: string]: string;
};
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
 * 具体单个案例的页面
 */
const Example: React.FC = () => {
  const { hash } = useLocation();
  const nav = useNavigate();
  const { topic, example } = useParams<ExampleParams>();
  /** 示例页面的元数据信息 */
  const metaData: any = useContext(ThemeAntVContext);
  const locale = useLocale();
  const { themeConfig } = useSiteData();

  const exampleTopics: ExampleTopic[] = metaData.meta.exampleTopics;
  const demo = hash.slice(1);

  const [currentDemo, setCurrentDemo] = useState<Demo>();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const [title, setTitle] = useState<title>({});

  useEffect(() => {
    if (topic && example && demo) {
      const targetDemoInfo = getDemoInfo(exampleTopics, topic, example, demo);
      setCurrentDemo(targetDemoInfo);
      setTitle(getCurrentTitle(exampleTopics, topic, example));
    }
  }, [topic, example, hash]);
  return (
    <div className={styles.example}>
      <SEO title={title[locale.id]} lang={locale.id} />
      <Header isHomePage={false} />
      <Layout className={styles.container}>
        <Sider
          collapsedWidth={0}
          width={250}
          trigger={null}
          collapsible
          collapsed={isCollapsed}
          className={styles.menuSider}
          theme="light"
        >
          {currentDemo && (
            <ExampleSider
              showExampleDemoTitle={true}
              currentDemo={currentDemo}
              onDemoClicked={(example) => {
                const { id: demoId, targetExample, targetTopic } = example;
                // eg: /zh/examples/case/area/#area1
                const newURL = `/${locale.id}/examples/${targetTopic?.id}/${targetExample?.id}/#${demoId}`;
                nav(newURL);
              }}
              exampleTopics={exampleTopics}
            />
          )}
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
          {topic && example && (
            <CodeRunner
              exampleTopics={exampleTopics}
              topic={topic}
              example={example}
              demo={demo}
              size={get(themeConfig, 'editor.size', 0.38)}
            />
          )}
        </Content>
      </Layout>
    </div>
  );
};

export default Example;
