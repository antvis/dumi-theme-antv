import { PlayCircleOutlined, PushpinOutlined } from '@ant-design/icons';
import React, { FC } from 'react';
import styles from './index.module.less';

interface ToolbarProps {
  onToggleCode: () => void;
  onRun: () => void;
  toolbarRef: React.RefObject<HTMLUListElement>;
}

export const Toolbar: FC<ToolbarProps> = ({ onToggleCode, onRun, toolbarRef }) => (
  <ul className={styles.ul} ref={toolbarRef}>
    <li onClick={onToggleCode} className={styles.li} title="Toggle Code Editor">
      <PushpinOutlined />
    </li>
    <li onClick={onRun} className={styles.li} title="Run Code">
      <PlayCircleOutlined />
    </li>
  </ul>
);
