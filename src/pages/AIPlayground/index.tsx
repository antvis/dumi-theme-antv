import React from 'react';
import {SessionLayout} from "./components/SessionLayout";
import MsgBox from "./components/MsgBox";
import TaskBox from "./components/TaskBox";

function AIPlayground() {
  return (
    <>

    <SessionLayout>
      <MsgBox/>
      <TaskBox/>
    </SessionLayout>
      </>
  );
}

export default AIPlayground;
