import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useSiteData, useIntl, useLocale } from 'dumi';
import loadable from '@loadable/component';
import { debounce, noop } from 'lodash-es';
import {
  useTranslation,
} from 'react-i18next';
import { replaceInsertCss, execute, compile } from './utils';

import { Toolbar, EDITOR_TABS } from './Toolbar';

import styles from './index.module.less';

const MonacoEditor = loadable(() => import('react-monaco-editor'));

export type CodeEditorProps = {
  /**
   * 标题
   */
  title?: string;
  /**
   * 输入的源码
   */
  source: string;
  /**
   * 经过编译之后的源码，包括 typescript 的处理。用于浏览器执行
   */
  babeledSource: string;
  /**
   * 相对地址
   */
  relativePath?: string;
  /**
   * 是否全屏状态
   */
  isFullscreen?: boolean;
  /**
   * 在一个文档中有多个 DEMO 的时候，需要有不同的 dom id
   */
  replaceId?: string;
  /**
   * 点击全屏按钮
   */
  onFullscreen: () => void;
  /**
   * 初始化
   */
  onReady: () => void;
  /**
   * 销毁
   */
  onDestroy: () => void;
  /**
   * 执行出错的时候，回调，方便上层做显示
   */
  onError: (e: any) => void;
  /**
   * playground 的一些配置
   */
  playground?: {
    container?: string;
    playgroundDidMount?: string;
    playgroundWillUnmount?: string;
    dependencies?: {
      [key: string]: string;
    };
    devDependencies?: {
      [key: string]: string;
    };
    htmlCodeTemplate?: string;
  };
}

/**
 * 代码编辑器
 */
export const CodeEditor: React.FC<CodeEditorProps> = ({
  title = '',
  source,
  babeledSource,
  relativePath = '',
  playground = {},
  replaceId = 'container',
  isFullscreen,
  onReady = noop,
  onDestroy = noop,
  onError = noop,
  onFullscreen = noop,
}) => {
  const { t, i18n } = useTranslation();
  const { extraLib = '' } = useSiteData().themeConfig.playground;
  const [compiledCode, setCompiledCode] = useState(babeledSource);
  // 编辑器两个 tab，分别是代码和数据
  const [data, setData] = useState(null);
  const [code, setCode] = useState(replaceInsertCss(source, i18n.language));
  // monaco instance
  const monacoRef = useRef<any>(null);
  // 文件后缀
  const fileExtension = relativePath.split('.')[relativePath.split('.').length - 1] || 'js';
  // 菜单栏
  const [editorTabs, setEditorTabs] = useState<EDITOR_TABS[]>([]);
  // 当前选中菜单栏
  const [currentEditorTab, setCurrentEditorTab] = useState(
    EDITOR_TABS.JAVASCRIPT,
  );
  // 出发 auto resize
  const dispatchResizeEvent = () => {
    const e = new Event('resize');
    window.dispatchEvent(e);
  };

  const executeCode = useCallback(debounce(() => {
    if (!compiledCode) {
      return;
    }
    // @todo 逍为
    execute(compiledCode, document.getElementById(replaceId) as any, 'todo', replaceId, onError);
  }, 300), []);

  useEffect(() => {
    executeCode();
  }, [compiledCode]);

  useEffect(() => {
    onReady();
    if (playground?.playgroundDidMount) {
      new Function(playground.playgroundDidMount)();
    }
    return () => {
      onDestroy();
      if (playground?.playgroundWillUnmount) {
        new Function(playground.playgroundWillUnmount)();
      }
    };
  }, []);

  // hook 用户的数据
  useEffect(() => {
    const dataFileMatch = source.match(/fetch\('(.*)'\)/);
    if (dataFileMatch && dataFileMatch.length > 0) {
      fetch(dataFileMatch[1])
        .then((response) => response.json())
        .then((data) => {
          setEditorTabs([EDITOR_TABS.JAVASCRIPT, EDITOR_TABS.DATA]);
          setData(data);
        });
    }
  }, []);

  const onCodeChange = useCallback((value: string) => {
    if (currentEditorTab === EDITOR_TABS.JAVASCRIPT) {
      setCode(value)
      try {
        const code = compile(source, relativePath);
        setCompiledCode(value);
        // 清除错误信息
        onError(null);
      } catch (e) {
        console.log(e);
        // 抛出错误信息
        onError(e);
      }
    }
  }, []);

  return (
    <div className={styles.editor}>
      <Toolbar
        fileExtension={fileExtension}
        sourceCode={code}
        playground={playground}
        location={location}
        title={title}
        isFullScreen={isFullscreen}
        editorTabs={editorTabs}
        currentEditorTab={currentEditorTab}
        onExecuteCode={executeCode}
        onEditorTabChange={setCurrentEditorTab}
        onToggleFullscreen={onFullscreen}
      />
      <div
        className={styles.monaco}
        style={{ height: 'calc(100% - 36px)' }}
      >
        <MonacoEditor
          language={
            currentEditorTab === EDITOR_TABS.JAVASCRIPT ? 'javascript' : 'json'
          }
          value={code}
          options={{
            readOnly: currentEditorTab === EDITOR_TABS.DATA,
            automaticLayout: true,
            minimap: {
              enabled: false,
            },
            scrollBeyondLastLine: false,
            fixedOverflowWidgets: true,
            lineNumbersMinChars: 4,
            showFoldingControls: 'always',
            foldingHighlight: true,
          }}
          onChange={(value: any) => onCodeChange(value)}
          editorWillMount={(monaco: any) => {
            try {
              monaco.editor.defineTheme('customTheme', {
                base: 'vs',
                inherit: true,
                rules: [],
                colors: {
                  'editor.inactiveSelectionBackground': '#ffffff',
                },
              });
              monaco.editor.setTheme('customTheme');
              // @todo why javascriptDefaults is undefined.
              monaco.languages.typescript.javascriptDefaults.addExtraLib(
                extraLib,
                '',
              );
            } catch (e) {
              console.log(e);
            }
          }}
          editorDidMount={(editorInstance: any) => {
            monacoRef.current = editorInstance.getModel();
          }}
        />
      </div>
    </div>
  );
}
