import React from 'react';
import { Sandpack } from "@codesandbox/sandpack-react";
import {projectFiles} from "./demo";

function TaskBox(props) {
  return (
    <Sandpack
      template="vanilla" // 指定项目模板，Sandpack 会据此配置环境
      files={projectFiles}
      options={{
        showLineNumbers: true, // 显示行号
        showTabs: true,
        closableTabs: true,
        editorHeight: "calc(100vh - 150px)",
      }}
      theme="light" // 主题：dark, light, auto
    />
  );
}

export default TaskBox;
