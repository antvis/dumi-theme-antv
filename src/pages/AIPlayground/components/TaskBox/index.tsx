import { useSiteData } from 'dumi';
import React, { useMemo } from 'react';
import { useSnapshot } from 'valtio';
import { AIChatStore } from '../../../../model/AIChat';
import CodeRunner from '../../../../slots/CodeRunner';
import {wrap2VisionSnap} from './generateCode';
import styles from './index.module.less';
import {requestProxy, useVisionsnapSdk} from "../../../../hooks/useVisionsnapSdk";
import { ErrorBoundary } from 'react-error-boundary';
import Loading from "../../../../slots/Loading";
import {ErrorFallback} from "../../../../builtins/Playground";

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

  const { sdk, loading } = useVisionsnapSdk('3.2.15');

  if (loading) {
    return <Loading />;
  }

  if (themeConfig.isAntVSite || themeConfig.ai?.codeRunner === "VisionSnap" || !themeConfig.ai?.codeRunner) {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <sdk.VisionPreview
          id="visionIframe"
          bizCode="vision-preview-demo"
          style={{ height: '100vh' }}
          userId="263347"
          displayMode="code-and-preview"
          initialView="preview"
          theme="light"
          editable
          code={wrap2VisionSnap(snap.codeBlock)}
          requestProxy={requestProxy}
          isStreaming={false}
          proxyOptions={{isWAN: true}}
          src={`https://www.weavefox.cn/_visionsnap_render/index.html?version=3.2.15&enableInspector=1`}
        />
      </ErrorBoundary>
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
