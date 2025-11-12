import React, { PropsWithChildren } from 'react';
import styles from './index.module.less';
import { ConversationsMenu } from '../ConversationsMenu';
import { AIChatStore } from '../../../../model/AIChat';
import { useSnapshot } from 'valtio';
import classnames from 'classnames';

type SessionLayoutProps = PropsWithChildren;

function SessionLayout(props: SessionLayoutProps) {
  const { children } = props;
  const snap = useSnapshot(AIChatStore);

  if (!Array.isArray(children)) {
    return null;
  }

  return (
    <div className={styles.container}>
      <ConversationsMenu/>
      <div className={classnames(styles.msgBox, {
        [styles.msgBoxHalf]: snap.codeBlock,
        [styles.msgBoxFull]: !snap.codeBlock
      })}>{children[0]}</div>
      {snap.codeBlock &&
        <div className={styles.taskBox}>{children[1]}</div>
      }
    </div>
  );
}

export {SessionLayout};
