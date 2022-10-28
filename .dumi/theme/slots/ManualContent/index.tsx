import React, { useEffect, useState } from 'react';
import { Layout, Affix, BackTop, Menu, Tooltip } from 'antd';
import { useMedia } from 'react-use';
import Drawer from 'rc-drawer';
import { useLocale, useSiteData, useFullSidebarData, useRouteMeta } from 'dumi';
import { useNavigate } from "react-router-dom";
import { EditOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import readingTime from 'reading-time'

import { NavigatorBanner } from './NavigatorBanner';
import ReadingTime from './ReadingTime';
import { TOC } from '../TOC';
import { useScrollToTop } from '../hooks';

import 'rc-drawer/assets/index.css';
import styles from './index.module.less';

export type ManualContent = {
  readonly children: any;
};

type PreAndNext = {
  slug?: string | undefined,
  title?: string | undefined
}

type linkToTitle = {
  [ket:string] :string
}

type MenuItem = {
  key: string,
  label?: string
  slug?: string,
  title: {
    zh: string,
    en: string,
  },
  order: number,
  link?: string,
  children?: MenuItem[]
} 

type FullSidebarData = {
  [key: string]: SidebarData
}

type SidebarData = MenuItem[]

/**
 * 文档的结构
 */
export const ManualContent: React.FC<ManualContent> = ({ children }) => {

  const locale = useLocale()
  const currentLocale: string = locale.id 

  const { themeConfig: { githubUrl, relativePath, docs } } = useSiteData();
  const sidebar = useFullSidebarData() as unknown as FullSidebarData

  const isWide = useMedia('(min-width: 767.99px)', true);
  const [drawOpen, setDrawOpen] = useState(false);
  const navigate = useNavigate();

  //  获取阅读时间
  const mdInfo = useRouteMeta()
  const text = mdInfo.texts.reduce((prev, next) => {
    return prev + next.value
  }, '');
  const { time } = readingTime(text);

  // menu渲染
    // linkoTitle用来映射路由和Title
  const linkoTitle: linkToTitle = {}
  
  function getBaseRoute() {
    let matchRoute = window.location.pathname
    const reg = window.location.pathname.startsWith('/en') ? /(\/[A-z]*\/?\/[A-z]*)\/?/ : /(\/[A-z]*)\/?/
    const mainRoute = matchRoute.match(reg)
    return mainRoute![1]
  }
  const baseRoute = getBaseRoute()
  
  function fullSidebarDataToMenuData(rootList: SidebarData, hrefId: string, list: SidebarData) {
    // 递归
    rootList.forEach(( item: MenuItem ) => {
      const href = !baseRoute.startsWith('/en') ? `/${item.slug}` : `/en/${item.slug}`
      const id = href.split("/").slice(0, href.split("/").length - 1).join("/")
      if (href.includes(baseRoute)) {
        if (id === hrefId) {
          list.push({
            ...item,
            key: href,
            label: item.title[currentLocale as 'zh' | 'en'] 
          })
        }
      }
    })
    for (const item of list) {
      item.children = []
      fullSidebarDataToMenuData(rootList, item.key, item.children)
      sidebar[item.key][0].children?.forEach(itemChild => {
        const label = itemChild.title as unknown as string
        const key =itemChild.link as string
        item.children!.push({
          ...itemChild,
          label,
          key
        })
        linkoTitle[key]=label
      })

      if (item.children.length == 0) {
        delete item.children
      }
    }
  
    if (hrefId == baseRoute) {
      sidebar[baseRoute] && sidebar[baseRoute][0].children?.forEach(itemChild => {
        const label = itemChild.title as unknown as string
        list.push({
          ...itemChild,
          label,
          key: itemChild.link!
        })
      })
      list.sort((a, b) => {
        return a.order - b.order;
      })
      return list;
    }
  }
    
  // 获取最终的MenuData
  const renderSidebar = fullSidebarDataToMenuData(docs, baseRoute, [])

  //  获取默认打开的菜单栏
  function getDefaultOpenKeys(MenuData: SidebarData) {
    const defaultOpenKeys=[]
    let topRoute = MenuData![0]
    defaultOpenKeys.push(topRoute.key)
    while (topRoute.children) {
      topRoute = topRoute.children[0]
      defaultOpenKeys.push(topRoute.key)
    }
    return defaultOpenKeys
  }
  const defaultOpenKeys: string[] = getDefaultOpenKeys(renderSidebar!)

  // 点击菜单栏
  const onClick = (e: any) => {
    navigate(e.key)
    useScrollToTop()
  };
  const [defaultSelectedKey, setDefaultSelectedKey] = useState<[string]>([renderSidebar![0].key])
  //上一夜下一页
  const [prev, setPrev] = useState<PreAndNext | undefined>(undefined)
  const [next, setNext] = useState<PreAndNext | undefined>(undefined)
 
  // 监听路由去改变selected menu-item
  useEffect(() => {
    if (window.location.pathname == baseRoute) {
      navigate(renderSidebar![0].key)
      return
    }
    setDefaultSelectedKey([window.location.pathname])
  }, [window.location.pathname])

  useEffect(() => {
    // 监听选中的menu-item 拿到 prev and next
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
      defaultOpenKeys={[...defaultOpenKeys]}
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
            <ReadingTime readingTime={time} className={styles.readtime}></ReadingTime>
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
