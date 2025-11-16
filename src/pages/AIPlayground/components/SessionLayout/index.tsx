import classnames from 'classnames';
import React, { PropsWithChildren, useState } from 'react';
import SplitPane from 'react-split-pane';
import { useSnapshot } from 'valtio';
import { AIChatStore } from '../../../../model/AIChat';
import { ConversationsMenu } from '../ConversationsMenu';
import styles from './index.module.less';

type SessionLayoutProps = PropsWithChildren;

function SessionLayout(props: SessionLayoutProps) {
  const { children } = props;
  const snap = useSnapshot(AIChatStore);
  const [isDragging, setIsDragging] = useState(false);

  if (!Array.isArray(children)) {
    return null;
  }

  return (
    <div className={styles.container}>
      <ConversationsMenu />
      {snap.codeBlock ? (
        // @ts-ignore
        <SplitPane
          split="vertical"
          defaultSize={'50vw'}
          onDragStarted={() => setIsDragging(true)}
          onDragFinished={() => setIsDragging(false)}
          primary="second"
          style={{
            position: 'unset',
          }}
          minSize={100}
        >
          <div className={classnames(styles.msgBox)}>{children[0]}</div>
          <div className={styles.taskBox}>{children[1]}</div>
        </SplitPane>
      ) : (
        <div className={classnames(styles.msgBox, styles.msgBoxFull)}>{children[0]}</div>
      )}
      {/* 拖动时的全局覆盖层,避免拖动过程中，鼠标移动到了一个 iframe 或者一个插件渲染的 canvas/svg 上，导致 Split-Pane 组件赖以工作的 mousemove 和 mouseup 事件丢失了。 */}
      {isDragging && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            cursor: 'col-resize', // 或 'row-resize' 用于水平分割
          }}
        />
      )}
    </div>
  );
}

export { SessionLayout };
