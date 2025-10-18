import React, { useState } from 'react';
import {
  HistoryOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import styles from './index.module.less';
import { useSnapshot } from 'valtio';
import { AIChatStore } from "../../../../model/AIChat";
import { history } from 'dumi';

type MenuItem = Required<MenuProps>['items'][number];

export const ConversationsMenu: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const snap = useSnapshot(AIChatStore);

  const handleSelectSession = (sessionId: string) => {
    AIChatStore.activeSessionId = sessionId;
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const items: MenuItem[] = [
    { key: 'fold', extra: !collapsed ? <MenuFoldOutlined /> : null, onClick: toggleCollapsed, label: null, icon: !collapsed ? null : <MenuUnfoldOutlined />, title: "展开" },
    { key: 'new', icon: <PlusSquareOutlined />, label: '开始新对话', onClick: () => history.push('/') },
    {
      key: 'history',
      label: '历史对话',
      icon: <HistoryOutlined />,
      children: snap.sessions.map(session => {
        return {
          key: session.id,
          label: session.title,
          onClick: () => handleSelectSession(session.id)
        }
      })
    },
  ];

  return (
    <div className={styles.container}>
      <Menu
        selectedKeys={[snap.activeSessionId]}
        defaultOpenKeys={['history']}
        mode="inline"
        theme="light"
        inlineCollapsed={collapsed}
        items={items}
      />
    </div>
  );
};
