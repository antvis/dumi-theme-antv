import React, { useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  HistoryOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusSquareOutlined, VerticalAlignTopOutlined,
} from '@ant-design/icons';
import {Dropdown, Input, MenuProps, Modal} from 'antd';
import { Menu } from 'antd';
import styles from './index.module.less';
import { useSnapshot } from 'valtio';
import {
  AIChatStore,
  createPureNewSession,
  handleDeleteSession,
  handlePinSession,
  handleRenameSession
} from "../../../../model/AIChat";
import {useSetState} from "ahooks";
import { useIntl } from 'dumi';
import {isUUID} from "../../../../utils";

type MenuItem = Required<MenuProps>['items'][number];

export const ConversationsMenu: React.FC = () => {
  const [state, setState] = useSetState({
    open: false,
    session: null,
    rename: '',
  });
  const [collapsed, setCollapsed] = useState(false);
  const snap = useSnapshot(AIChatStore);

  const handleSelectSession = (sessionId: string) => {
    if (isUUID(sessionId)) {
      AIChatStore.activeSessionId = sessionId;
    }
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const { formatMessage } = useIntl();

  const items: MenuItem[] = [
    {
      key: 'fold',
      extra: !collapsed ? <MenuFoldOutlined /> : null,
      onClick: toggleCollapsed,
      label: null,
      icon: !collapsed ? null : <MenuUnfoldOutlined />,
      title: collapsed ? formatMessage({ id: 'ai.conversations.expand' }) : formatMessage({ id: 'ai.conversations.collapse' }),
    },
    { key: 'new', icon: <PlusSquareOutlined />, label: formatMessage({ id: 'ai.conversations.new' }), onClick: () => createPureNewSession() },
    {
      key: 'history',
      label: formatMessage({ id: 'ai.conversations.history' }),
      icon: <HistoryOutlined />,
      children: snap.sessions.map((session) => {
        return {
          key: session.id,
          label: (
            <div className={styles.menuItem}>
              <span className={styles.title}>{session.title}</span>
              <Dropdown
                menu={{
                  items: [
                    { key: 'edit', label: formatMessage({ id: 'ai.conversations.rename' }), icon: <EditOutlined />,
                      onClick: ({ domEvent }) => {
                        domEvent.stopPropagation();
                        setState({ open: true, session: session , rename: session.title})
                      }, },
                    {
                      key: 'top',
                      label: formatMessage({ id: 'ai.conversations.pin' }),
                      icon: <VerticalAlignTopOutlined />,
                      onClick: ({ domEvent }) => {
                        domEvent.stopPropagation();
                        handlePinSession(session.id);
                      },
                    },
                    {
                      key: 'delete',
                      label: formatMessage({ id: 'ai.conversations.delete' }),
                      icon: <DeleteOutlined />,
                      onClick: ({ domEvent }) => {
                        domEvent.stopPropagation();
                        handleDeleteSession(session.id);
                      },
                    },
                  ],
                }}
                trigger={['click']}
              >
                <span
                  className={styles.iconWrapper}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <EllipsisOutlined />
                </span>
              </Dropdown>
            </div>
          ),
        };
      }),
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
        onSelect={({ key }) => handleSelectSession(key)}
      />
      <Modal
        title={formatMessage({ id: 'ai.conversations.edit.title' })}
        open={state.open}
        centered
        maskClosable={false}
        onOk={() => {
          handleRenameSession(state.session.id, state.rename);
          setState({ open: false });
        }}
        onCancel={() => setState({ open: false })}
        okButtonProps={{
          disabled: !state.rename,
        }}
      >
        <Input showCount maxLength={20} onChange={(e) => setState({rename: e.target.value})} value={state.rename} />
      </Modal>
    </div>
  );
};
