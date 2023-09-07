import React, { useEffect, useState } from 'react';
import { useSiteData, useLocale } from 'dumi';
import { noop } from 'lodash-es';
import SplitPane from 'react-split-pane';
import { CodeEditor } from '../CodeEditor';
import { CodePreview } from '../CodePreview';
import { CodeHeader } from '../CodePreview/CodeHeader';
import { getDemoInfo } from './utils';
import { NotFound } from '../404';
import { ic } from '../hooks';
import { ExampleTopic } from '../../types';
import { compile, replaceInsertCss } from './utils';

type CodeRunnerProps = {
  isPlayground?: boolean;
  topic: string;
  example: string;
  demo: string;
  exampleTopics: ExampleTopic[];
  size?: number;
  replaceId?: string;
  notFound?: React.JSX.Element;
}

/**
 * 代码编辑器 + 代码预览区域
 */
export const CodeRunner: React.FC<CodeRunnerProps> = ({
  exampleTopics, topic, example, demo, size, replaceId, isPlayground,
  notFound = <NotFound />,
}) => {
  const demoInfo = getDemoInfo(exampleTopics, topic, example, demo);

  // 找不到，啥也别干了，404 页面
  if (!demoInfo) return notFound;

  const { title, source, relativePath } = demoInfo;

  const { themeConfig } = useSiteData();
  const { githubUrl, playground } = themeConfig;
  const [compileError, setCompileError] = useState<ErrorEvent>();
  const [isFullScreen, setFullscreen] = useState<boolean>(false);

  const [code, setCode] = useState(source);
  const [compileCode, setCompileCode] = useState(null);
  const locale = useLocale();
  const header = <CodeHeader title={ic(title)} relativePath={relativePath} githubUrl={githubUrl} />;
  const exampleId = `${topic}_${example}_${demo}`;

  useEffect(() => {
    setCode(source);
  }, [source]);

  useEffect(() => {
    try {
      setCompileCode(compile(replaceInsertCss(code, locale.id), relativePath, true));
      setCompileError(null);
    } catch(e) {
      console.log('compile error', e); // for debugger
      setCompileError(e);
    }
  }, [code]);

  return (
    <SplitPane split='vertical' defaultSize={`${(1 - size) * 100}%`} minSize={100}>
      <CodePreview
        exampleId={exampleId}
        source={compileCode}
        header={header}
        isPlayground={isPlayground}
        compileError={compileError}
      />
      <CodeEditor
        exampleId={exampleId}
        source={source}
        relativePath={relativePath}
        replaceId={replaceId}
        onFullscreen={setFullscreen}
        onDestroy={noop}
        onReady={noop}
        onExecute={(source) => setCode(source)}
        playground={playground}
      />
    </SplitPane>
  );
}
