import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import React from 'react';
import styles from './index.module.less';

interface CollapsedProps {
  isCollapsed: boolean;
  style?: React.CSSProperties;
  onClick?: (isCollapsed: boolean) => void;
}
export const CollapsedIcon: React.FC<CollapsedProps> = (props) => {
  const { isCollapsed, onClick, style } = props;
  return (
    <div
      className={styles.collapsed}
      onClick={() => {
        onClick(!isCollapsed);
      }}
      style={style}
    >
      {isCollapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
    </div>
  );
};
