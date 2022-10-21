import React, { useEffect, useState } from 'react';
import { Layout, Affix, BackTop, Menu } from 'antd';
import { useMedia } from 'react-use';
import Drawer from 'rc-drawer';

import { useSidebarData } from 'dumi';
import { useNavigate } from "react-router-dom";
import { MenuFoldOutlined, MenuUnfoldOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';

import 'rc-drawer/assets/index.css';
import styles from './index.module.less';
import { NavigatorBanner } from './NavigatorBanner';
export type ManualContent = {
  readonly children: any;
};

interface PreAndNext {
  slug?: string | undefined,
  title?: string | undefined
}
/**
 * 文档的结构
 */
export const ManualContent: React.FC<ManualContent> = ({ children }) => {
  const isWide = useMedia('(min-width: 767.99px)', true);
  const [drawOpen, setDrawOpen] = useState(false);
  const sidebar = useSidebarData();
  //menu渲染
  const renderSidebar = sidebar[0].children.map(item => {
    return {
      ...item,
      label: item.title,
      key: item.link,
      title: item.link
    }
  })
  const navigate = useNavigate();

  const onClick = (e: any) => {
    navigate(e.key)
  };

  const [defaultSelectedKey, setdefaultSelectedKey] = useState([window.location.pathname])
  const [prev, setPrev] = useState<PreAndNext | undefined>(undefined)
  const [next, setNext] = useState<PreAndNext | undefined>(undefined)
  const [currentMenuItem, setCurrentMenuItem] = useState(undefined)


  //监听路由去改变selected menu-item
  useEffect(() => {
    setdefaultSelectedKey([window.location.pathname])
  }, [window.location.pathname])

  useEffect(() => {
    //监听选中的menu-item 拿到 prev and next 
    getPreAndNext()
  }, [defaultSelectedKey])


  function getPreAndNext() {
    const menuNodes = document.querySelectorAll('aside .ant-menu-item');
    const currentMenuNode = document.querySelector(
      'aside .ant-menu-item-selected',
    );
    setCurrentMenuItem(currentMenuNode?.textContent)
    const currentIndex = Array.from(menuNodes).findIndex(
      (node) => node === currentMenuNode,
    );

    const prevNode =
      currentIndex - 1 >= 0 ? menuNodes[currentIndex - 1] : undefined;
    const nextNode =
      currentIndex + 1 < menuNodes.length
        ? menuNodes[currentIndex + 1]
        : undefined;

    setPrev((prevNode
      ? {
        slug: prevNode.getAttribute('link') || undefined,
        title: prevNode.textContent || undefined,
      }
      : undefined))
    setNext((nextNode
      ? {
        slug: nextNode.getAttribute('link') || undefined,
        title: nextNode.textContent || undefined,
      }
      : undefined))
  }

  const menu = (
    <Menu
      onClick={onClick}
      defaultSelectedKeys={defaultSelectedKey}
      selectedKeys={defaultSelectedKey}
      defaultOpenKeys={['sub1']}
      mode="inline"
      items={renderSidebar}
      inlineIndent={16}
      style={{ height: '100%' }}
      forceSubMenuRender
    />
  );

  return (
    <>
      <Layout
        style={{ background: '#fff' }}
        hasSider
        className={styles.layout}>
        <Affix
          offsetTop={0}
          className={styles.affix}
          style={{ height: isWide ? '100vh' : 'inherit' }}
        >

          {isWide ? (
            <Layout.Sider width="auto" theme="light" className={styles.sider}>
              {menu}
            </Layout.Sider>
          ) : (
            <Drawer
              handler={
                drawOpen ? (
                  <MenuFoldOutlined className={styles.menuSwitch} />
                ) : (
                  <MenuUnfoldOutlined className={styles.menuSwitch} />
                )
              }
              wrapperClassName={styles.menuDrawer}
              onChange={(open?: Boolean) => setDrawOpen(!!open)}
              width={280}
            >
              {menu}
            </Drawer>
          )}

        </Affix>

        <Layout.Content className={styles.content}>
          <div className={styles.contentMain}>
            <h1 className={styles.title}>{currentMenuItem}
            </h1>

            <div className={styles.readtime}>阅读时间 6 分钟</div>
            <div className={styles.markdown}>
              {children}
            </div>
            <div>
              <div className={styles.preandnext}>
                <NavigatorBanner type="prev" post={prev} />
                <NavigatorBanner type="next" post={next} />
              </div>
            </div>
          </div>
        </Layout.Content>
        <Layout.Sider theme="light">TOC</Layout.Sider>
      </Layout>
    </>
  );
};

