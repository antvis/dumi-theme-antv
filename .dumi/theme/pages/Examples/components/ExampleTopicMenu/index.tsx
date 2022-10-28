import React, { useState } from 'react';
import { Affix, Layout as AntLayout } from 'antd';
import Drawer from 'rc-drawer';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useMedia } from 'react-use';
import { LeftMenuProps } from '../../types';
import { LeftMenu } from './components/LeftMenu';
import styles from '../../index.module.less';

const url = require('url')


/**
 * Examples 左侧 LeftMenu
 *
 * @param {LeftMenuProps} props 相关参数，详见类型定义
 * @returns {React.FC} React.FC
 */
export const ExampleTopicMenu: React.FC<LeftMenuProps> = (props) => {
  const { exampleTopics } = props;

  const isWide = useMedia('(min-width: 767.99px)', true);
  const [drawOpen, setDrawOpen] = useState(false);

  return (
    <Affix
      offsetTop={0}
      className={styles.affix}
      style={{ height: isWide ? '100vh' : 'inherit' }}
    >
      {isWide ? (
        <div>
          <AntLayout.Sider width='auto' theme='light' className={styles.sider}>
            <LeftMenu exampleTopics={exampleTopics} />
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
          <LeftMenu exampleTopics={exampleTopics} />
        </Drawer>
      )}
    </Affix>
  );
};
