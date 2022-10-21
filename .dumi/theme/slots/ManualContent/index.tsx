import React, { useState } from 'react';
import { Layout, Affix, BackTop, Menu, Anchor } from 'antd';
import { useMedia } from 'react-use';
import Drawer from 'rc-drawer';
import { useSidebarData } from 'dumi';
import { useNavigate } from "react-router-dom";
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { TOC } from '../TOC';

import 'rc-drawer/assets/index.css';
import styles from './index.module.less';


export type ManualContent = {
  readonly children: any;
};

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
      key: item.link
    }
  })
  const navigate = useNavigate();

  const onClick = (e: any) => {
    navigate(e.key)
  };

  const menu = (
    <Menu
      onClick={onClick}
      defaultSelectedKeys={['/api']}
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
              onChange={(open: Boolean) => setDrawOpen(!!open)}
              width={280}
            >
              {menu}
            </Drawer>
          )}

        </Affix>

        <Layout.Content className={styles.main}>
          <h1 className={styles.title}>项目介绍</h1>
          <div className={styles.readtime}>阅读时间 6 分钟</div>
          <div className={styles.markdown}>
            {children}
          </div>
          <div className={styles.navigator}>
            <div className={styles.prev}>Prev</div>
            <div className={styles.next}>Next</div>
          </div>
          <BackTop />
        </Layout.Content>
        { /** @toc-width: 260px; */ }
        <Layout.Sider theme="light" width={260} >
          <Affix
            className={styles.toc}
          >
            <TOC />
          </Affix>
        </Layout.Sider>
      </Layout>
    </>
  );
};

