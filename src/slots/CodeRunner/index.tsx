import React, { useState } from 'react';
import { useSiteData, useLocale } from 'dumi';
import { noop } from 'lodash-es';
import SplitPane from 'react-split-pane';
import { CodeEditor } from '../CodeEditor';
import { CodePreview } from '../CodePreview';
import { CodeHeader } from '../CodePreview/CodeHeader';
import { getDemoInfo } from './utils';
import { NotFound } from '../404';
import { ExampleTopic } from '../../types';

type CodeRunnerProps = {
  topic: string;
  example: string;
  demo: string;
  exampleTopics: ExampleTopic[];
  size?: number;
  notFound?: React.Element;
}

/**
 * 代码编辑器 + 代码预览区域
 */
export const CodeRunner: React.FC<CodeRunnerProps> = ({
  exampleTopics, topic, example, demo, size,
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

  const header = <CodeHeader title={title[locale.id]} relativePath={relativePath} githubUrl={githubUrl} />;

  return (
    <SplitPane split='vertical' defaultSize={`${(1 - size) * 100}%`} minSize={100}>
      <CodePreview error={error} header={header} />
      <CodeEditor
        source={source}
        relativePath={relativePath}
        onError={setError}
        onFullscreen={setFullscreen}
        onDestroy={noop}
        onReady={noop}
        playground={playground}
      />
    </SplitPane>
  );
}
