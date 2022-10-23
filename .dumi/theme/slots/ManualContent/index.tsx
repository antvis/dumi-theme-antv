import React, { useEffect, useState } from 'react';
import { Layout, Affix, BackTop, Menu, Tooltip } from 'antd';
import { useMedia } from 'react-use';
import Drawer from 'rc-drawer';
import { useSidebarData,useSiteData } from 'dumi';
import { useNavigate } from "react-router-dom";
import { EditOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { NavigatorBanner } from './NavigatorBanner';
import { TOC } from '../TOC';

import 'rc-drawer/assets/index.css';
import styles from './index.module.less';
import { useScrollToTop } from '../hooks';

export type ManualContent = {
  readonly children: any;
};

interface PreAndNext {
  slug?: string | undefined,
  title?: string | undefined
}

interface linkToTitle{
  [ket:string] :string
}
/**
 * 文档的结构
 */
export const ManualContent: React.FC<ManualContent> = ({ children }) => {
  const { themeConfig: { githubUrl, relativePath } } = useSiteData();
  const sidebar = useSidebarData();

  const isWide = useMedia('(min-width: 767.99px)', true);
  const [drawOpen, setDrawOpen] = useState(false);
  const navigate = useNavigate();

  //menu渲染
    //linkoTitle用来映射路由和Title
  const linkoTitle: linkToTitle = {}
  
  const renderSidebar = sidebar[0].children.map(item => {
    const key=item.link 
    linkoTitle[key]=item.title 
    return {
      ...item,
      label: item.title,
      key: item.link,
    }
  })

  //点击菜单栏
  const onClick = (e: any) => {
    navigate(e.key)
    useScrollToTop()
  };
  const [defaultSelectedKey, setdefaultSelectedKey] = useState([window.location.pathname])
  //上一夜下一页
  const [prev, setPrev] = useState<PreAndNext | undefined>(undefined)
  const [next, setNext] = useState<PreAndNext | undefined>(undefined)

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
    // @ts-ignore
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
const getGithubSourceUrl = ({
    githubUrl,
    relativePath,
    prefix,
  }: {
    githubUrl: string;
    relativePath: string;
    prefix: string;
  }): string => {
    // https://github.com/antvis/x6/tree/master/packages/x6-sites
    if (githubUrl.includes('/tree/master/')) {
      return `${githubUrl.replace(
        '/tree/master/',
        '/edit/master/',
      )}/${prefix}/${relativePath}`;
    }
    return `${githubUrl}/edit/master/${prefix}/${relativePath}`;
  };
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
              onChange={(open?: boolean) => setDrawOpen(!!open)}
              width={280}
            >
              {menu}
            </Drawer>
          )}

        </Affix>
        <Layout.Content className={styles.content}>
          <div className={styles.contentMain}>
            <h1>
              {linkoTitle[window.location.pathname]}
              <Tooltip title={'在 GitHub 上编辑'}>
                <a
                  href={getGithubSourceUrl({
                    githubUrl,
                    relativePath,
                    prefix: 'docs',
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.editOnGtiHubButton}
                >
                  <EditOutlined />
                </a>
              </Tooltip>
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
        { /** @toc-width: 260px; */}
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
