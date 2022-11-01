import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Input, Menu, Tooltip } from 'antd';
import { useLocale } from 'dumi';
import {
  createFromIconfontCN,
  SearchOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';
import { useT } from '../hooks';
import styles from './index.module.less';
import { filterTreeNode } from '../utils';

// menu icon
const MenuIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_470089_1lnym745udm.js', // generated by iconfont.cn
});

export interface ExampleSiderProps {
  /**
   * 当前 Example (受控)
   */
  currentDemo: ExamplesPage.Demo;

  /**
   * 当选中的 Demo 被改变时做些什么
   */
  onDemoClicked: (demo: ExamplesPage.Demo) => void;

  /**
   * 所有的案例主题
   */
  exampleTopics: ExamplesPage.ExampleTopic[];

  showExampleDemoTitle: boolean;
}

/**
 * DEMO 预览页面的菜单
 */
export const ExampleSider: React.FC<ExampleSiderProps> = (props) => {
  const { currentDemo, onDemoClicked, exampleTopics } = props;
  // 菜单栏展开keys
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const menuRef = useRef<Menu | null>(null);

  // 初始化点击进来的示例按钮a的dom
  const [aRef, setARef] = useState<HTMLAnchorElement>();

  // input 搜索框的value
  const [searchValue, setSearchValue] = useState<string>('');

  const locale = useLocale();

  const getCurrentTopics = () => {
    if (searchValue) {
      const res = filterTreeNode({
        id: 'FAKE_ID',
        childrenKey: 'exampleTopics',
        title: {
          'zh': 'FAKE_TITLE',
          'en': 'FAKE_TITLE',
        },
        exampleTopics: exampleTopics,
      }, searchValue, locale.id);
      return res?.exampleTopics || [];
    }
    return exampleTopics;
  };

  console.log(getCurrentTopics());

  // 初始化菜单栏展开keys
  useEffect(() => {
    const { targetExample, targetTopic } = currentDemo;
    setOpenKeys([`TOPIC-${targetTopic?.id}`, `EXAMPLE-${targetExample?.id}`]);
  }, [currentDemo]);

  // 初始化滚动到中间
  useEffect(() => {
    if (aRef) {
      aRef.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
    }
  }, [aRef]);

  // 获取搜索后的文本结构 左文本 + 搜索文本 + 右文本
  const getSearchValueTitle = (title: string): ReactNode =>
    searchValue && title.match(searchValue) ? (
      <>
        <span>{title.replace(new RegExp(`${searchValue}.*`), '')}</span>
        <span className={styles.searchValue}>{searchValue}</span>
        <span>{title.replace(new RegExp(`.*?${searchValue}`), '')}</span>
      </>
    ) : (
      title
    );

  // 图例按钮 + img + tooltip文本
  const renderExampleDemoCard = (demo: ExamplesPage.Demo) => (
    <Tooltip
      placement='right'
      title={getSearchValueTitle(demo.title[locale.id] || '')}
      key={demo.id}
    >
      <a
        ref={(dom) => {
          // TODO: DEAL WITH ME
          // if (dom && !aRef && item.value === getPath(currentExample)) {
          //   setARef(dom);
          // }
        }}
        className={classNames(styles.card, {
          [styles.current]: currentDemo.id === demo.id,
        })}
      >
        <div
          className={classNames(styles.screenshot)}
          style={{
            backgroundImage: `url(${
              demo.screenshot ||
              'https://gw.alipayobjects.com/os/s/prod/antv/assets/image/screenshot-placeholder-b8e70.png'
            })`,
          }}
          title={demo.title[locale.id]}
        />
      </a>
    </Tooltip>
  );

  const renderSubMenu = () => {
    return getCurrentTopics().map((topic) => {
      return (
        <Menu.SubMenu
          key={`TOPIC-${topic.id}`}
          title={
            <div>
              {topic.icon && (
                <MenuIcon
                  className={styles.menuIcon}
                  type={`icon-${topic.icon}`}
                />
              )}
              <span
                className={classNames(
                  styles.menuTitleContent,
                  styles.subMenuTitleContent,
                )}
              >
                {topic.title && getSearchValueTitle(topic.title[locale.id])}
              </span>
            </div>
          }
        >
          {topic.examples.map((example) => {
            return (
              <Menu.SubMenu
                key={`EXAMPLE-${example.id}`}
                title={example.title[locale.id]}
              >
                {example.demos.map((demo) => {
                  return (
                    <Menu.Item
                      key={`DEMO-${demo.id}`}
                      style={{
                        height: 70,
                        padding: 0,
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        onDemoClicked({
                          ...demo,
                          targetExample: example,
                          targetTopic: topic,
                        });
                      }}
                    >
                      <span className={styles.menuTitleContent}>
                        {renderExampleDemoCard(demo)}
                      </span>
                    </Menu.Item>
                  );
                })}
              </Menu.SubMenu>
            );
          })}
        </Menu.SubMenu>
      );
    });
  };

  // 搜索栏
  const renderSearchBar = () => {
    return (
      <div className={styles.searchSider}>
        <Input
          size='small'
          placeholder={useT('搜索…')}
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={(e: any) => setSearchValue(e.target.value)}
        />
        <Tooltip placement='right' title={useT('收起所有') as React.ReactNode}>
          <VerticalAlignTopOutlined
            className={styles.searchSiderIcon}
            onClick={() => setOpenKeys([])}
          />
        </Tooltip>
      </div>
    );
  };

  return (
    <div className={classNames(styles.shadowWrapper)}>
      {renderSearchBar()}
      <Menu
        ref={menuRef}
        mode='inline'
        style={{ width: '100%' }}
        className={styles.sideBarMenu}
        openKeys={openKeys}
        selectedKeys={[`DEMO-${currentDemo.id}`]}
        onOpenChange={(keys) => {
          setOpenKeys(keys);
        }}
      >
        {renderSubMenu()}
      </Menu>
    </div>
  );
};
