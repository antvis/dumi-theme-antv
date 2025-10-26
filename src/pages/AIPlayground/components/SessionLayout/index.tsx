import React, { PropsWithChildren } from 'react';
import styles from './index.module.less';
import { ConversationsMenu } from '../ConversationsMenu';
import { AIChatStore } from '../../../../model/AIChat';
import { useSnapshot } from 'valtio';
import classnames from 'classnames';
import SplitPane from 'react-split-pane';

type SessionLayoutProps = PropsWithChildren;

function SessionLayout(props: SessionLayoutProps) {
  const { children } = props;
  const snap = useSnapshot(AIChatStore);

  if (!Array.isArray(children)) {
    return null;
  }

  return (
    <div className={styles.container}>
      <ConversationsMenu />
      {
        // @ts-ignore
        snap.codeBlock ? ( <SplitPane split="vertical" defaultSize={"50vw"} primary="second" style={{
            position: "unset"
          }}>
            <div
              className={classnames(styles.msgBox)}
            >
              {children[0]}
            </div>
            <div className={styles.taskBox}>{children[1]}</div>
          </SplitPane>
        ) : (
          <div
            className={classnames(styles.msgBox, styles.msgBoxFull)}
          >
            {children[0]}
          </div>
        )
      }
    </div>
  );
}

export { SessionLayout };
