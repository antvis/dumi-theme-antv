import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Affix, Drawer, Layout, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { useMedia } from 'react-use';
import { useMenu } from '../../hooks/useMenu';
import { getAncestorMenuItems } from '../../utils/menu';
import styles from './index.module.less';

export const Sidebar: React.FC = () => {
  const [drawOpen, setDrawOpen] = useState(false);
  const [menuItems, selectedKey] = useMenu();

  const is767Wide = useMedia('(min-width: 767.99px)', true);

  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    const items = getAncestorMenuItems(menuItems, selectedKey);
    setOpenKeys((prev) => [...new Set([...prev, ...items.map((item) => item.key)])]);
  }, [menuItems, selectedKey]);

  const menu = (
    <Menu
      key="sider-menu"
      openKeys={openKeys}
      onOpenChange={(openKeys) => setOpenKeys(openKeys)}
      selectedKeys={[selectedKey]}
      mode="inline"
      items={menuItems}
      inlineIndent={16}
      style={{ height: '100%' }}
      triggerSubMenuAction="click"
      forceSubMenuRender
    />
  );

  const Icon = drawOpen ? MenuFoldOutlined : MenuUnfoldOutlined;

  return (
    <Affix offsetTop={0} className={styles.affix} style={{ height: is767Wide ? '100vh' : 'inherit' }}>
      {is767Wide ? (
        <Layout.Sider width="auto" theme="light" className={styles.sider}>
          {menu}
        </Layout.Sider>
      ) : (
        <Drawer
          handler={<Icon className={styles.menuSwitch} />}
          wrapperClassName={styles.menuDrawer}
          onChange={(open?: boolean) => setDrawOpen(!!open)}
          width={280}
        >
          {menu}
        </Drawer>
      )}
    </Affix>
  );
};
