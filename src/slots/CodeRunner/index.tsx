import { useLocale, useSiteData } from 'dumi';
import { noop } from 'lodash-es';
import React, { useState } from 'react';
import SplitPane from 'react-split-pane';
import ClientOnly from '../../common/ClientOnly';
import InViewSuspense from '../../common/InViewSuspense';
import type { ExampleTopic } from '../../types';
import { NotFound } from '../404';
import CodeHeader from '../CodePreview/CodeHeader';
import { ic } from '../hooks';
import { getDemoInfo } from './utils';

const CodeEditor = React.lazy(() => import('../CodeEditor'));
const CodePreview = React.lazy(() => import('../CodePreview'));

type CodeRunnerProps = {
  isPlayground?: boolean;
  topic: string;
  example: string;
  demo: string;
  exampleTopics: ExampleTopic[];
  size?: number;
  replaceId?: string;
  notFound?: React.ReactElement;
};

/**
 * 代码编辑器 + 代码预览区域
 */
const CodeRunner: React.FC<CodeRunnerProps> = ({
  exampleTopics,
  topic,
  example,
  demo,
  size,
  replaceId,
  isPlayground,
  notFound = <NotFound />,
}) => {
  const demoInfo = getDemoInfo(exampleTopics, topic, example, demo);

  // 找不到，啥也别干了，404 页面
  if (!demoInfo) return notFound;

  const { title, source, relativePath } = demoInfo;

  const { themeConfig } = useSiteData();
  const { githubUrl, playground } = themeConfig;
  const [error, setError] = useState<Error>();
  const [isFullScreen, setFullscreen] = useState<boolean>(false);
  const locale = useLocale();

  const header = <CodeHeader title={ic(title)} relativePath={relativePath} githubUrl={githubUrl} />;

  const exampleId = `${topic}_${example}_${demo}`;

  return (
    <InViewSuspense fallback={null}>
      {/* @ts-ignore */}
      <SplitPane split="vertical" defaultSize={`${(1 - size) * 100}%`} minSize={100}>
        {/* 代码预览区域 */}
        <CodePreview exampleId={exampleId} error={error} header={header} isPlayground={isPlayground} />

        {/* 代码编辑区域 */}
        <ClientOnly>
          <CodeEditor
            exampleId={exampleId}
            source={source}
            relativePath={relativePath}
            replaceId={replaceId}
            onError={setError}
            onFullscreen={setFullscreen}
            onDestroy={noop}
            onReady={noop}
            playground={playground}
          />
        </ClientOnly>
      </SplitPane>
    </InViewSuspense>
  );
};

export default CodeRunner;
