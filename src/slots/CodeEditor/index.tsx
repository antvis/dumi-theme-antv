import ReactDOM from 'react-dom';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import MonacoEditor, { loader } from '@monaco-editor/react';
import { useSiteData, useLocale } from 'dumi';
import { debounce, noop } from 'lodash-es';
import { bind, clear } from 'size-sensor';
import { replaceInsertCss, execute, compile } from './utils';
import { Toolbar, EDITOR_TABS } from './Toolbar';
import { Loading } from '../Loading';
import styles from './index.module.less';

loader.config({
  'vs/nls': {
    availableLanguages: {
      '*': 'zh-cn',
    },
  },
  paths: {
    vs: 'https://gw.alipayobjects.com/os/lib/monaco-editor/0.34.0/min/vs',
  },
});

export type CodeEditorProps = {
  /**
   * 标题
   */
  title?: string;
  /**
   * 示例的 id
   */
  exampleId: string;
  /**
   * 输入的源码
   */
  source: string;
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
  onFullscreen: (isFullScreen: boolean) => void;
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
  playground: {
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
  relativePath = '',
  playground,
  replaceId = 'container',
  isFullscreen,
  exampleId,
  onReady = noop,
  onDestroy = noop,
  onError = noop,
  onFullscreen = noop,
}) => {
  const locale = useLocale()
  const { extraLib = '' } = useSiteData().themeConfig.playground;
  // 编辑器两个 tab，分别是代码和数据
  const [data, setData] = useState(null);
  const [code, setCode] = useState(source);
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

  const containerId = `playgroundScriptContainer_${exampleId}`;

  // 出发 auto resize
  const dispatchResizeEvent = () => {
    const e = new Event('resize');
    window.dispatchEvent(e);
  };

  const reportError = useCallback((e) => {
    if (e) {
      console.log(e);
      onError(e);
      e.preventDefault && e.preventDefault();
    } else {
      onError(null);
    }
  }, []);
  
  useEffect(() => {
    // 用于上报错误信息，使用 script 执行代码
    if (typeof window !== 'undefined') {
      // Cath error of code.
      (window as any).__reportErrorInPlayground = reportError;
      // Catch error of timeout/raf.
      window.onerror = reportError
      // Catch error of  promise.
      window.addEventListener('unhandledrejection', reportError);
    }
    return () => {
      if (window) {
        (window as any).__reportErrorInPlayground = undefined;
        window.onerror = undefined;
        window.removeEventListener('unhandledrejection', reportError);
      }
    }
  }, []);

  const executeCode = useCallback(debounce((v: string) => {
    if (!v) return;
    
    // 1. 先编译代码
    let compiled;
    try {
      compiled = compile(replaceInsertCss(v, locale.id), relativePath);
    } catch (e) {
      reportError(e);
      // 执行出错，后面的步骤不用做了！
      return;
    }

    // 2. 执行代码，try catch 在内部已经做了
    execute(compiled, containerId, playground?.container as string, replaceId);
  }, 300), [containerId]);

  useEffect(() => {
    setCode(source);
  }, [source]);

  useEffect(() => {
    executeCode(code);
  }, [code]);

  useEffect(() => {
    const dom = document.getElementById(containerId);
    if (dom) {
      bind(dom, debounce(() => {
        dispatchResizeEvent();
      }, 100));
    }
    
    onReady();
    if (playground?.playgroundDidMount) {
      new Function(playground.playgroundDidMount)();
    }
    return () => {
      dom && clear(dom);
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

  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.setValue(
        currentEditorTab === EDITOR_TABS.JAVASCRIPT ? code : JSON.stringify(data, null, 2),
      );
    }
  }, [currentEditorTab]);

  const onCodeChange = useCallback((value: string) => {
    if (currentEditorTab === EDITOR_TABS.JAVASCRIPT) {
      setCode(value)
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
        onExecuteCode={() => executeCode(code)}
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
          path={relativePath}
          loading={<Loading />}
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
          onChange={onCodeChange}
          onMount={(editor: any) => {
            monacoRef.current = editor;          
          }}
        />
      </div>
    </div>
  );
}
