import { Sandpack } from '@codesandbox/sandpack-react';
import { useSiteData } from 'dumi';
import React, { useMemo } from 'react';
import { useSnapshot } from 'valtio';
import { AIChatStore } from '../../../../model/AIChat';
import CodeRunner from '../../../../slots/CodeRunner';
import { wrap2Sandpack } from './generateCode';
import styles from './index.module.less';
// import {code} from "../../demo";
// import {requestProxy, useVisionsnapSdk} from "../../../../hooks/useVisionsnapSdk";

function TaskBox() {
  const snap = useSnapshot(AIChatStore);
  const { themeConfig } = useSiteData();
  const demoId = useMemo(() => crypto.randomUUID(), [snap.codeBlock]);
  const exampleTopics = useMemo(
    () => [
      {
        icon: '',
        title: {},
        id: snap.anonymousUserId,
        examples: [
          // 这是一个 Example 对象
          {
            icon: '',
            title: {},
            id: snap.activeSessionId,
            api: 'https://example.com/api/pie-chart', // 必须的 api 属性
            demos: [
              // 这是一个 Demo 对象
              {
                id: demoId,
                screenshot: '',
                title: {},
                filename: 'index.tsx', // 必须的 filename 属性
                source: snap.codeBlock,
              },
            ],
          },
        ],
      },
    ],
    [demoId, snap.activeSessionId, snap.anonymousUserId, snap.codeBlock],
  );

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
  if (themeConfig.isAntVSite) {
    return (
      <Sandpack
        template="vanilla" // 指定项目模板，Sandpack 会据此配置环境
        files={wrap2Sandpack(snap.codeBlock)}
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
          entry: '/index.tsx',
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
  } else {
    return (
      <CodeRunner
        isPlayground
        showAI={false}
        size={0.5}
        topic={snap.anonymousUserId}
        example={snap.activeSessionId}
        demo={demoId}
        exampleTopics={exampleTopics}
      />
    );
  }
}

export default TaskBox;
