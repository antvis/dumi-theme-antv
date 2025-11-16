import React from 'react';
import {SessionLayout} from "./components/SessionLayout";
import MsgBox from "./components/MsgBox";
import TaskBox from "./components/TaskBox";
import Header from "../../slots/Header";
import styles from "./index.module.less";

function AIPlayground() {
  return (
    <div className={styles.aiPlayground}>
      <Header />
      <SessionLayout>
        <MsgBox/>
        <TaskBox/>
      </SessionLayout>
    </div>
  );
}

export default AIPlayground;
