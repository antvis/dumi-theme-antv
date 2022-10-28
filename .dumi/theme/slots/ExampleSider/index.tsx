import { Input, Menu, Tooltip } from 'antd';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import Icon, { createFromIconfontCN, SearchOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { difference, map, reduce, size } from 'lodash-es';
import { useT } from '../hooks';
import styles from './index.module.less';
import { useLocale } from 'dumi';
import examples from '@/.dumi/theme/pages/Examples';

export interface PlayGroundItemProps {
  source: string;
  examples: PlayGroundItemProps[];
  babeledSource: string;
  absolutePath?: string;
  relativePath?: string;
  screenshot?: string;
  recommended?: boolean;
  filename: string;
  title?: string;
  location?: Location;
  playground?: {
    container?: string;
    playgroundDidMount?: string;
    playgroundWillUnmount?: string;
    dependencies?: {
      [key: string]: string;
    };
    devDependencies?: {
      [key: string]: string;
    };
    htmlCodeTemplate?: string;
  };
}

export interface TreeItem {
  title?: string;
  value?: string;
  key?: string;
  children?: any;
  icon?: string;
  relativePath?: string;
  filename?: string;
  screenshot?: string;
  node?: any;
}


// menu icon
const MenuIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_470089_1lnym745udm.js', // generated by iconfont.cn
});

export interface ExampleSiderProps {
  /**
   * 获得当前选中的示例 key 值
   */
  getPath: (currentExample: PlayGroundItemProps) => string;

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
  const { getPath, currentDemo, onDemoClicked, showExampleDemoTitle, exampleTopics } = props;

  // 菜单栏展开keys
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const menuRef = useRef<Menu | null>(null);

  // 初始化点击进来的示例按钮a的dom
  const [aRef, setARef] = useState<HTMLAnchorElement>();

  // input 搜索框的value
  const [searchValue, setSearchValue] = useState<string>('');

  const locale = useLocale();


  // 查找符合条件的数据 从title和 searchValue 可以匹配 就返回 否自返回[]
  const findSearchTreeData = (data: TreeItem[]): TreeItem[] =>
    reduce(
      data,
      (value: TreeItem[], item: TreeItem) => {
        if (item.title?.match(searchValue)) {
          return [...value, item];
        }
        if (item.children) {
          const searchData = findSearchTreeData(item.children);
          return size(searchData)
            ? [...value, { ...item, children: searchData }]
            : value;
        }
        return value;
      },
      [],
    );

  // 控制 菜单栏展开key 保证二级菜单唯一
  const onOpenChange = (keys: any[]) => {
    let newKeys = keys;
    const diffKey = difference(keys, openKeys)[0];
    if (diffKey && /^secondaryKey-/.test(diffKey)) {
      newKeys = [
        ...newKeys.filter((key) => !/^secondaryKey-/.test(key)),
        diffKey,
      ];
    }
    setOpenKeys(newKeys);
  };

  // 获取默认展开的keys数组 传入treeData 和 底层的 key  返回符合条件的 keys
  const getDefaultOpenKeys = (data: TreeItem[], key: string): string[] =>
    reduce(
      data,
      (value: any[], item: TreeItem) => {
        if (item.children) {
          const keys = getDefaultOpenKeys(item.children, key);
          return keys.length ? [...value, item.value, ...keys] : value;
        }
        return key === item.value ? [item.value] : value;
      },
      [],
    );

  // 初始化菜单栏展开keys
  useEffect(() => {
    console.log(currentDemo);
    setOpenKeys(['TOPIC-case', 'EXAMPLE-area', 'DEMO-area5']);
    // const exampleKey = getPath(currentExample);
    // setOpenKeys(getDefaultOpenKeys(getTreeData(), exampleKey));
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
          // TODO: DEAL WITH ME
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
    return exampleTopics.map((topic) => {
      return (
        <Menu.SubMenu key={`TOPIC-${topic.id}`} title={
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
        }>
          {topic.examples.map((example) => {
            return (
              <Menu.SubMenu key={`EXAMPLE-${example.id}`} title={example.title[locale.id]}>
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
                      <span className={styles.menuTitleContent}>{renderExampleDemoCard(demo)}</span>
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
          <Icon
            // TODO: 解除注释
            // component={CollaspeAllSvg}
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
        className={styles.siderbarMenu}
        openKeys={openKeys}
        // selectedKeys={[getPath(currentExample)]}
        onOpenChange={onOpenChange}
      >
        {renderSubMenu()}
      </Menu>
    </div>
  );
};
