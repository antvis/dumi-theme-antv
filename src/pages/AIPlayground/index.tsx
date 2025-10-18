import React from 'react';
import {SessionLayout} from "./components/SessionLayout";
import MsgBox from "./components/MsgBox";
import TaskBox from "./components/TaskBox";
import Header from "../../slots/Header";

function AIPlayground() {
  return (
    <>
      <Header />
      <SessionLayout>
        <MsgBox/>
        <TaskBox/>
      </SessionLayout>
    </>
  );
}

export default AIPlayground;
