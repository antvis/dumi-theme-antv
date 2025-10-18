import React from 'react';
import {Sandpack} from "@codesandbox/sandpack-react";
import {projectFiles} from "../../demo";
import styles from "./index.module.less";
// import {code} from "../../demo";
// import {requestProxy, useVisionsnapSdk} from "../../../../hooks/useVisionsnapSdk";



function TaskBox() {

    // const { sdk, loading } = useVisionsnapSdk('3.2.4');
    //
    // if (loading) {
    //   return <div>Loading...</div>;
    // }
    //
    // return (
    //     <sdk.VisionPreview id="visionIframe"
    //                        bizCode="vision-preview-demo"
    //                        style={{ height: '100vh' }}
    //                        userId="263347"
    //                        displayMode="preview-only"
    //                        editable={false}
    //                        code={code}
    //                        // requestProxy={requestProxy}
    //                        isStreaming={false} />
    // );

  return (
    <Sandpack
      template="vanilla" // 指定项目模板，Sandpack 会据此配置环境
      files={projectFiles}
      options={{
        showLineNumbers: true, // 显示行号
        showTabs: true,
        closableTabs: false,
        editorHeight: 'calc(100vh - 150px)',
        rtl: true,
        classes: {
          'sp-layout': styles['antv-sp-layout'],
        },
      }}
      theme="light" // 主题：dark, light, auto
      customSetup={{
        npmRegistries: [
          {
            limitToScopes: false, // 设为 false 使所有包都从自定义 registry 获取
            registryUrl: 'https://registry.npmmirror.com', // 使用淘宝镜像
            enabledScopes: [],
            proxyEnabled: false,
          },
        ],
      }}
    />
  );
}

export default TaskBox;
