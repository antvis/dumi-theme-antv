import React, { useState } from 'react';
import { Affix, Anchor, Layout as AntLayout, Menu } from 'antd';
import Drawer from 'rc-drawer';
import { createFromIconfontCN, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useMedia } from 'react-use';
import { debounce, groupBy } from 'lodash-es';
import { useLocale } from 'dumi';

import { LeftMenuProps } from '../../types';
import { getGroupedEdges, getGroupedEdgesDataEdit } from '../../../../slots/utils';
import styles from '../../index.module.less';

/**
 * Examples 左侧 Menu
 *
 * @param {LeftMenuProps} props 相关参数，详见类型定义
 * @returns {React.FC} React.FC
 */
export const LeftMenu: React.FC<LeftMenuProps> = (props) => {
  const { edges, examples, exampleTopics } = props;
  console.log(exampleTopics);
  const locale = useLocale();

  const isWide = useMedia('(min-width: 767.99px)', true);
  const [drawOpen, setDrawOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const MenuIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_470089_1lnym745udm.js', // generated by iconfont.cn
  });

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const onAnchorLinkChange = debounce((currentActiveLink: string) => {
    let currentSlug = '';
    edges.forEach((edge) => {
      const {
        node: {
          frontmatter: { title },
          fields: { slug },
        },
      } = edge;

      if (`#category-${title.replace(/\s/g, '')}` === currentActiveLink) {
        currentSlug = slug;
      }
    });

    setSelectedKeys([currentSlug]);

    if (currentActiveLink) {
      const link = document.querySelector(`a[href='${currentActiveLink}']`);
      if (link) {
        const anchor = link?.parentNode as Element;
        anchor.scrollIntoView({
          block: 'center',
        });
      }
    }
  }, 300);


  const getMenuItemLocaleKey = (slug = '') => {
    const slugPieces = slug.split('/');
    return slugPieces
      .slice(slugPieces.indexOf('examples') + 1)
      .filter((key) => key)
      .join('/');
  };

  const groupedEdges = getGroupedEdges(edges);

  // 提取出筛选 和 排序的方法 好在获取treeData 的时候使用
  const groupedEdgesDataEdit = getGroupedEdgesDataEdit(examples, edges, locale.id);


  const renderMenu = () => {
    return (
      <Anchor className={styles.galleryAnchor} onChange={onAnchorLinkChange}>
        <Menu
          mode='inline'
          selectedKeys={selectedKeys}
          style={{ height: '100%' }}
          openKeys={openKeys}
          onOpenChange={(currentOpenKeys) =>
            setOpenKeys(currentOpenKeys as string[])
          }
          forceSubMenuRender
        >
          {exampleTopics.map((topic) => {
            return <Menu.SubMenu key={topic.id} title={
              <div>
                {topic.title[locale.id]}
              </div>
            }>
              {topic.examples.map((example) => {
                return <Menu.Item key={example.id}>
                  <Anchor.Link
                    href={`#category-${example.id.replace(/\s/g, '')}`}
                    title={
                      <div>
                        {example.icon && (
                          <MenuIcon className={styles.menuIcon} type={`icon-${example.icon}`} />
                        )}
                        <span>{example.title[locale.id]}</span>
                      </div>
                    }
                  />
                </Menu.Item>;
              })}
            </Menu.SubMenu>;
          })}
          {/*{groupedEdgesDataEdit.map((slugString) => {*/}
          {/*  const slugPieces = slugString.split('/');*/}
          {/*  if (slugPieces.length <= 3) {*/}
          {/*    return renderAnchorItems(groupedEdges[slugString]);*/}
          {/*  }*/}
          {/*  const menuItemLocaleKey = getMenuItemLocaleKey(slugString);*/}
          {/*  const doc =*/}
          {/*    examples.find((item: any) => item.slug === menuItemLocaleKey) || {};*/}
          {/*  return (*/}
          {/*    <Menu.SubMenu*/}
          {/*      key={slugString}*/}
          {/*      title={*/}
          {/*        <div>*/}
          {/*          {doc.icon && (*/}
          {/*            <MenuIcon*/}
          {/*              className={styles.menuIcon}*/}
          {/*              type={`icon-${doc.icon}`}*/}
          {/*            />*/}
          {/*          )}*/}
          {/*          <span>*/}
          {/*          {doc && doc.title*/}
          {/*            ? doc.title[locale.id]*/}
          {/*            : menuItemLocaleKey}*/}
          {/*        </span>*/}
          {/*        </div>*/}
          {/*      }*/}
          {/*    >*/}
          {/*      {renderAnchorItems(groupedEdges[slugString])}*/}
          {/*    </Menu.SubMenu>*/}
          {/*  );*/}
          {/*})}*/}
        </Menu>
      </Anchor>
    );
  };

  return (
    <Affix
      offsetTop={0}
      className={styles.affix}
      style={{ height: isWide ? '100vh' : 'inherit' }}
    >
      {isWide ? (
        <div>
          <AntLayout.Sider width='auto' theme='light' className={styles.sider}>
            {renderMenu()}
          </AntLayout.Sider>
        </div>
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
          onChange={(open: any) => setDrawOpen(!!open)}
          width={280}
        >
          {renderMenu()}
        </Drawer>
      )}
    </Affix>
  );
};
