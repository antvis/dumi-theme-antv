import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import styles from './index.module.less';

type MenuItem = Required<MenuProps>['items'][number];

export const ConversationsMenu: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const items: MenuItem[] = [
    { key: 'fold', extra: !collapsed ? <MenuUnfoldOutlined /> : null, onClick: toggleCollapsed, label: null, icon: !collapsed ? null : <MenuFoldOutlined />, title: "展开" },
    { key: 'new', icon: <PlusSquareOutlined />, label: '开始新对话' },
  ];

  return (
    <div className={styles.container}>
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="light"
        inlineCollapsed={collapsed}
        items={items}
      />
    </div>
  );
};
