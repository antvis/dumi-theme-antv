import { useSiteData } from 'dumi';
import React, { useMemo } from 'react';
import { useSnapshot } from 'valtio';
import { AIChatStore } from '../../../../model/AIChat';
import CodeRunner from '../../../../slots/CodeRunner';
import {wrap2VisionSnap} from './generateCode';
import {requestProxy, useVisionsnapSdk} from "../../../../hooks/useVisionsnapSdk";
import { ErrorBoundary } from 'react-error-boundary';
import Loading from "../../../../slots/Loading";
import {ErrorFallback} from "../../../../builtins/Playground";
import {useAntVConfig} from "../../../../hooks/useProducts";

function TaskBox() {
  const { data: {VisionSnapVersion: version} = {VisionSnapVersion: '3.5.12'}} = useAntVConfig();
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

  const { sdk, loading } = useVisionsnapSdk(version);

  if (loading) {
    return <Loading />;
  }

  const wrappedVisionSnapCode = wrap2VisionSnap(snap.codeBlock);

  const handleEsmLoadFailed = (err: any) => {
      AIChatStore.errorMsg = err.data?.error?.split('\n')?.[0] ||
        JSON.stringify(err) ||
        err.message;
  }

  if (themeConfig.isAntVSite || themeConfig.ai?.codeRunner === "VisionSnap" || !themeConfig.ai?.codeRunner || !wrappedVisionSnapCode.modules["/package.json"].code.includes("@antv/f2")) {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <sdk.VisionPreview
          id="visionIframe"
          bizCode="antv"
          style={{ height: '100vh' }}
          userId="antv"
          displayMode="code-and-preview"
          initialView="preview"
          theme="light"
          code={wrappedVisionSnapCode}
          requestProxy={requestProxy}
          isStreaming={false}
          proxyOptions={{isWAN: true}}
          src={`https://www.weavefox.cn/_visionsnap_render${wrappedVisionSnapCode.modules["/package.json"].code.includes("vue") ? '_vue' : ''}/index.html?version=${version}&enableInspector=1`}
          onEsmLoadFailed={handleEsmLoadFailed}
          previewZoomConfig={{
            defaultZoomMode: 100
          }}
        />
      </ErrorBoundary>
    );
  } else {
    return (
      <CodeRunner
        isPlayground
        showAI={false}
        showEditor={false}
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
