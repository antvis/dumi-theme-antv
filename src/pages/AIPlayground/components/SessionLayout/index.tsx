import React, { PropsWithChildren } from 'react';
import styles from './index.module.less';

type SessionLayoutProps = PropsWithChildren;

function SessionLayout(props: SessionLayoutProps) {
  const { children } = props;

  if (!Array.isArray(children)) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.msgBox}>{children[0]}</div>
      <div className={styles.taskBox}>{children[1]}</div>
    </div>
  );
}

export {SessionLayout};
