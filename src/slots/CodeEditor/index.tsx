import MonacoEditor, { loader } from '@monaco-editor/react';
import { autoType as d3AutoType, dsvFormat } from 'd3-dsv';
import { useLocale, useSiteData } from 'dumi';
import { debounce, noop } from 'lodash-es';
import { format } from 'prettier';
import parserBabel from 'prettier/parser-babel';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { bind, clear } from 'size-sensor';
import { Loading } from '../Loading';
import { EDITOR_TABS, Toolbar } from './Toolbar';
import styles from './index.module.less';
import { compile, execute, replaceInsertCss } from './utils';

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
};

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
  const locale = useLocale();
  const { themeConfig } = useSiteData();
  const { es5 = true, showSpecTab = false } = themeConfig;
  const { extraLib = '' } = themeConfig.playground;
  // 编辑器两个 tab，分别是代码和数据
  const [data, setData] = useState(null);
  const [spec, setSpec] = useState(null);
  const [code, setCode] = useState(source);
  // monaco instance
  const monacoRef = useRef<any>(null);
  // 文件后缀
  const fileExtension =
    relativePath.split('.')[relativePath.split('.').length - 1] || 'js';
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
      window.onerror = reportError;
      // Catch error of  promise.
      window.addEventListener('unhandledrejection', reportError);
    }
    return () => {
      if (window) {
        (window as any).__reportErrorInPlayground = undefined;
        window.onerror = undefined;
        window.removeEventListener('unhandledrejection', reportError);
      }
    };
  }, []);

  const executeCode = useCallback(
    debounce((v: string) => {
      if (currentEditorTab !== EDITOR_TABS.JAVASCRIPT) return;
      if (!v) return;

      // 1. 先编译代码
      let compiled;
      try {
        compiled = compile(replaceInsertCss(v, locale.id), relativePath, es5);
      } catch (e) {
        reportError(e);
        // 执行出错，后面的步骤不用做了！
        return;
      }

      // 2. 执行代码，try catch 在内部已经做了
      execute(
        compiled,
        containerId,
        playground?.container as string,
        replaceId,
      );
    }, 300),
    [exampleId, currentEditorTab],
  );

  const updateData = (data) => {
    if (!data) return;
    const tabs = showSpecTab
      ? [EDITOR_TABS.JAVASCRIPT, EDITOR_TABS.SPEC, EDITOR_TABS.DATA]
      : [EDITOR_TABS.JAVASCRIPT, EDITOR_TABS.DATA];
    setEditorTabs(tabs);
    setData(data);
  };

  // 找到 spec 里面的 online data 并且更新它
  const updateDataFromSpec = (options) => {
    if (!options) return;
    const discoverd = [options];
    const dataList = [];
    while (discoverd.length) {
      const node = discoverd.pop();
      const { data } = node;
      if (typeof data === 'object' && data.type === 'fetch') {
        dataList.push(data);
      }
      discoverd.push(...(node.children || []));
    }
    fetchData(dataList.map((d) => d.value)).then(updateData);
  };

  // 案例变化的时候，修改代码
  useEffect(() => {
    setCode(source);

    // 清空 data 和 spec
    // 放在该案例运行错误，返回之前案例的 data 和 spec
    setData(null);
    if (showSpecTab) setSpec(null);
  }, [exampleId]);

  // 代码变化的时候，运行代码
  useEffect(() => {
    executeCode(code);
  }, [code]);

  useEffect(() => {
    const dom = document.getElementById(containerId);
    if (dom) {
      bind(
        dom,
        debounce(() => {
          dispatchResizeEvent();
        }, 100),
      );
    }
    return () => {
      dom && clear(dom);
    };
  }, []);

  // 生命周期
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

  // fetch 多份远程数据，如果有多份合并成一份。
  const fetchData = async (urls) => {
    const parseCSV = (response) => {
      return response.text().then((text) => {
        return dsvFormat(',').parse(text, d3AutoType);
      });
    };
    const parseJSON = (response) => response.json();
    const dataList = await Promise.all(
      urls.map((url) =>
        fetch(url).then((response) => {
          const format = url.split('.').pop();
          if (format === 'csv') return parseCSV(response);
          return parseJSON(response);
        }),
      ),
    );
    if (dataList.length <= 1) return dataList[0];
    return Object.fromEntries(urls.map((url, index) => [url, dataList[index]]));
  };

  // 切换 example 的时候，切换到代码编辑页面
  // 用于更新当前 example 的 spec 和 data
  useEffect(() => {
    setCurrentEditorTab(EDITOR_TABS.JAVASCRIPT);
  }, [exampleId]);

  // hook 用户的数据
  useEffect(() => {
    // 需要匹配首位的换行符，以及 ' 和 "
    const match = source.matchAll(/fetch\(\s*["|'](.*)["|'],*\s*\)/g);
    const dataFileMatch = Array.from(match);
    if (dataFileMatch && dataFileMatch.length > 0) {
      fetchData(dataFileMatch.map((d) => d[1].trim())).then((data) => {
        updateData(data);
      });
    } else {
      const tabs = showSpecTab
        ? [EDITOR_TABS.JAVASCRIPT, EDITOR_TABS.SPEC]
        : [EDITOR_TABS.JAVASCRIPT];
      setEditorTabs(tabs);
    }
  }, [exampleId]);

  // 监听更新 spec 的事件，这是一个定义事件，需要在 .dumi/global.ts 里面 dispatch
  useEffect(() => {
    const update = (e) => {
      const { options } = e.detail as any;
      setSpec(options);
      updateDataFromSpec(options);
    };
    window.addEventListener('spec', update);
    return () => {
      window.removeEventListener('spec', update);
    };
  });

  // 切换 tab
  const onTabChange = useCallback(
    (tab) => {
      setCurrentEditorTab(tab);
    },
    [exampleId],
  );

  // useEffect(() => {
  //   if (monacoRef.current) {
  //     const v = currentEditorTab === EDITOR_TABS.JAVASCRIPT ? code : JSON.stringify(data, null, 2);
  //     monacoRef.current.setValue(v);
  //   }
  // }, [currentEditorTab]);

  const onCodeChange = useCallback(
    (value: string, event) => {
      if (!event.isFlush && currentEditorTab === EDITOR_TABS.JAVASCRIPT) {
        setCode(value);
      }
    },
    [currentEditorTab],
  );

  const parseFunction = (string) => {
    return string.replace(/"\<func\>(.*?)\<\/func\>"/g, (_, code) =>
      code.replace(/\\n/g, '\n').replace(/\\"/g, '"'),
    );
  };

  // 序列化 JavaScript 对象的时候对 function 进行特殊的标注，
  // 使得解析该字符串的时候能方便的提取 function 对应的字符串。
  // { add: (x, y) => x + y } => '{ add: <func>(x, y) => x + y</func> }'
  const withFunction = (_: string, value: any) => {
    if (typeof value !== 'function') return value;
    return `<func>${value.toString()}</func>`;
  };

  const languageOf = (tab) => {
    switch (tab) {
      case EDITOR_TABS.JAVASCRIPT:
      case EDITOR_TABS.SPEC:
        return 'javascript';
      case EDITOR_TABS.DATA:
        return 'json';
      default:
        return 'javascript';
    }
  };

  const valueOf = (tab) => {
    switch (tab) {
      case EDITOR_TABS.JAVASCRIPT:
        return code;
      case EDITOR_TABS.SPEC:
        return format(
          parseFunction(`(${JSON.stringify(spec, withFunction)})`),
          {
            plugins: [parserBabel],
          },
        );
      case EDITOR_TABS.DATA:
        return JSON.stringify(data, null, 2);
      default:
        return null;
    }
  };

  const defaultOf = (tab) => {
    switch (tab) {
      case EDITOR_TABS.JAVASCRIPT:
        return code;
      default:
        return null;
    }
  };

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
        onEditorTabChange={onTabChange}
        onToggleFullscreen={onFullscreen}
      />
      {editorTabs.map((tab) => (
        <div
          key={tab}
          className={styles.monaco}
          style={{
            height: 'calc(100% - 36px)',
            display: tab === currentEditorTab ? 'block' : 'none',
          }}
        >
          <MonacoEditor
            language={languageOf(tab)}
            value={valueOf(tab)}
            defaultValue={defaultOf(tab)}
            path={tab}
            loading={<Loading />}
            options={{
              readOnly: tab === EDITOR_TABS.DATA || tab === EDITOR_TABS.SPEC,
              automaticLayout: true,
              minimap: { enabled: false },
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
      ))}
    </div>
  );
};
