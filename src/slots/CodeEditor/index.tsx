import MonacoEditor, { loader } from '@monaco-editor/react';
import { autoType as d3AutoType, dsvFormat } from 'd3-dsv';
import { useLocale, useSiteData } from 'dumi';
import { debounce, noop } from 'lodash-es';
import { format } from 'prettier';
import parserBabel from 'prettier/parser-babel';
import { useMemoizedFn } from 'ahooks';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { bind, clear } from 'size-sensor';
import Loading from '../Loading';
import styles from './index.module.less';
import { EDITOR_TABS, Toolbar } from './Toolbar';
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

// ---- 纯工具函数，不依赖组件状态，提取到组件外部避免重复创建 ----

/** 将 JSON 中的 <func>...</func> 标记还原为真实函数代码 */
function parseFunction(str: string): string {
  return str.replace(/"\<func\>(.*?)\<\/func\>"/g, (_, code) =>
    code.replace(/\\n/g, '\n').replace(/\\"/g, '"'),
  );
}

/** JSON.stringify replacer：将 function 值标记为 <func>...</func> 以便后续还原 */
function withFunction(_: string, value: any): any {
  if (typeof value !== 'function') return value;
  return `<func>${value.toString()}</func>`;
}

/** 将 spec 配置对象转换为完整可执行的 JS 代码字符串 */
function specToCode(specObj: any): string {
  const specStr = parseFunction(JSON.stringify(specObj, withFunction));
  const fullCode = `import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container' });

chart.options(${specStr});

chart.render();
`;
  return format(fullCode, { plugins: [parserBabel] });
}

// ---- 组件类型定义 ----

export type CodeEditorProps = {
  /** 标题 */
  title?: string;
  /** 示例的 id */
  exampleId: string;
  /** 输入的源码 */
  source: string;
  /** 相对地址 */
  relativePath?: string;
  /** 是否全屏状态 */
  isFullscreen?: boolean;
  /** 在一个文档中有多个 DEMO 的时候，需要有不同的 dom id */
  replaceId?: string;
  /** 点击全屏按钮 */
  onFullscreen: (isFullScreen: boolean) => void;
  /** 初始化 */
  onReady: () => void;
  /** 销毁 */
  onDestroy: () => void;
  /** 执行出错的时候，回调，方便上层做显示 */
  onError: (e: any) => void;
  /** playground 的一些配置 */
  playground: {
    container?: string;
    playgroundDidMount?: string;
    playgroundWillUnmount?: string;
    dependencies?: { [key: string]: string };
    devDependencies?: { [key: string]: string };
    htmlCodeTemplate?: string;
  };
  showAI?: boolean;
  style?: React.CSSProperties;
};

/**
 * 代码编辑器
 * showSpecTab=true 时为 Spec first 模式：
 *   - Spec tab（可编辑）：spec 风格代码，选中时用此代码执行
 *   - API tab（可编辑）：原始 JS 代码，选中时用此代码执行
 *   - 两个 tab 各自独立维护代码状态
 * showSpecTab=false 时为传统模式：
 *   - 只有 Spec tab，直接编辑和执行 source 代码
 */
const CodeEditor: React.FC<CodeEditorProps> = ({
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
  showAI = true,
  style,
}) => {
  const locale = useLocale();
  const { themeConfig } = useSiteData();
  const { es5 = true, showSpecTab = false } = themeConfig;
  const { playgroundBeforeExecute = '' } = themeConfig.playground;

  const [data, setData] = useState(null);
  // Spec tab 的代码（仅 showSpecTab=true 时使用，由 spec 事件初始化）
  const [specCode, setSpecCode] = useState<string | null>(null);
  // API tab 的代码（传统模式下也作为唯一代码源）
  const [apiCode, setApiCode] = useState(source);
  // monaco instance
  const monacoRef = useRef<any>(null);
  // 文件后缀
  const fileExtension = relativePath.split('.')[relativePath.split('.').length - 1] || 'js';
  // 菜单栏
  const [editorTabs, setEditorTabs] = useState<EDITOR_TABS[]>([]);
  // 当前选中菜单栏
  const [currentEditorTab, setCurrentEditorTab] = useState(EDITOR_TABS.SPEC);

  const containerId = `playgroundScriptContainer_${exampleId}`;

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

  // 注册全局错误捕获
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__reportErrorInPlayground = reportError;
      window.onerror = reportError;
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

  // 编译并执行代码的核心逻辑，通过 useMemoizedFn 保证始终引用最新的 containerId
  const executeCodeFn = useMemoizedFn((v: string) => {
    try {
      const playgroundBeforeExecuteFunction = new Function('containerId', playgroundBeforeExecute);
      playgroundBeforeExecuteFunction(containerId);
    } catch (e) {
      reportError(e);
    }

    if (!v) return;

    let compiled;
    try {
      compiled = compile(replaceInsertCss(v, locale.id), relativePath, es5);
    } catch (e) {
      reportError(e);
      return;
    }

    execute(compiled, containerId, playground?.container as string, replaceId);
  });

  // debounce 实例只创建一次，内部通过 executeCodeFn 间接调用，避免闭包过期
  const executeCode = useRef(debounce((v: string) => executeCodeFn(v), 300)).current;

  // 切例子时取消 pending，避免上一案例的代码渲染到新容器
  useEffect(() => {
    executeCode.cancel();
  }, [exampleId]);
  useEffect(() => () => executeCode.cancel(), []);

  /** 根据指定 tab 获取对应的可执行代码 */
  const getCodeForTab = useCallback((tab: EDITOR_TABS): string => {
    if (tab === EDITOR_TABS.DATA) return '';
    if (tab === EDITOR_TABS.API) return apiCode;
    // SPEC tab：传统模式用 apiCode，Spec 模式用 specCode
    return showSpecTab ? (specCode || '') : apiCode;
  }, [specCode, apiCode, showSpecTab]);

  const updateData = (data) => {
    if (!data) return;
    const tabs = showSpecTab
      ? [EDITOR_TABS.SPEC, EDITOR_TABS.API, EDITOR_TABS.DATA]
      : [EDITOR_TABS.SPEC, EDITOR_TABS.DATA];
    setEditorTabs(tabs);
    setData(data);
  };

  // 从 spec 对象中提取远程数据 URL 并 fetch
  const updateDataFromSpec = (options) => {
    if (!options) return;
    const discovered = [options];
    const dataList = [];
    while (discovered.length) {
      const node = discovered.pop();
      const { data } = node;
      if (typeof data === 'object' && data.type === 'fetch') {
        dataList.push(data);
      }
      discovered.push(...(node.children || []));
    }
    fetchData(dataList.map((d) => d.value)).then(updateData);
  };

  // fetch 多份远程数据，多份时合并为 { url: data } 映射
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
          const fmt = url.split('.').pop();
          if (fmt === 'csv') return parseCSV(response);
          return parseJSON(response);
        }),
      ),
    );
    if (dataList.length <= 1) return dataList[0];
    return Object.fromEntries(urls.map((url, index) => [url, dataList[index]]));
  };

  // 案例变化时：重置所有状态 + 重置 tab + 解析数据 + 执行初始代码
  // 合并为单一 effect，消除多个 [exampleId] effect 的隐式顺序依赖
  useEffect(() => {
    // 重置状态
    setApiCode(source);
    setSpecCode(null);
    setData(null);
    setCurrentEditorTab(EDITOR_TABS.SPEC);

    // 解析 source 中的 fetch URL，加载远程数据
    const match = source.matchAll(/fetch\(\s*["|'](.*)["|'],*\s*\)/g);
    const dataFileMatch = Array.from(match);
    if (dataFileMatch && dataFileMatch.length > 0) {
      fetchData(dataFileMatch.map((d) => d[1].trim())).then((data) => {
        updateData(data);
      });
    } else {
      const tabs = showSpecTab ? [EDITOR_TABS.SPEC, EDITOR_TABS.API] : [EDITOR_TABS.SPEC];
      setEditorTabs(tabs);
    }

    // 执行初始代码
    executeCode(source);
  }, [exampleId]);

  // 绑定容器 resize 监听
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

  // 监听 spec 事件（由代码执行后 dispatch），首次收到时初始化 specCode
  // 使用 ref 避免闭包过期问题，同时保持 [] 依赖数组只注册一次
  const specCodeRef = useRef(specCode);
  specCodeRef.current = specCode;

  useEffect(() => {
    const update = (e) => {
      const { options } = e.detail as any;
      if (!options) return;
      updateDataFromSpec(options);
      // 仅在 specCode 未初始化时设置（首次从 source 执行产生）
      if (specCodeRef.current === null) {
        setSpecCode(specToCode(options));
      }
    };
    window.addEventListener('spec', update);
    return () => {
      window.removeEventListener('spec', update);
    };
  }, []);

  // 切换 tab 时，用目标 tab 对应的代码重新执行渲染
  const onTabChange = useCallback(
    (tab: EDITOR_TABS) => {
      setCurrentEditorTab(tab);
      const code = getCodeForTab(tab);
      if (code) executeCode(code);
    },
    [getCodeForTab],
  );

  /**
   * 编辑时更新对应 tab 的代码并执行
   * 统一数据源：传统模式下 Spec tab 写入 apiCode
   */
  const onCodeChange = useCallback(
    (value: string, event) => {
      if (event.isFlush) return;
      if (currentEditorTab === EDITOR_TABS.SPEC) {
        if (showSpecTab) {
          setSpecCode(value);
        } else {
          // 传统模式：Spec tab 就是唯一的代码 tab，写入 apiCode
          setApiCode(value);
        }
        executeCode(value);
      } else if (currentEditorTab === EDITOR_TABS.API) {
        setApiCode(value);
        executeCode(value);
      }
    },
    [currentEditorTab, showSpecTab],
  );

  const languageOf = (tab: EDITOR_TABS) => {
    switch (tab) {
      case EDITOR_TABS.SPEC:
      case EDITOR_TABS.API:
        return 'javascript';
      case EDITOR_TABS.DATA:
        return 'json';
      default:
        return 'javascript';
    }
  };

  /** 获取 tab 对应的编辑器显示内容（统一数据源） */
  const valueOf = (tab: EDITOR_TABS) => {
    switch (tab) {
      case EDITOR_TABS.SPEC:
        // 传统模式用 apiCode，Spec 模式用 specCode
        return showSpecTab ? (specCode || '') : apiCode;
      case EDITOR_TABS.API:
        return apiCode;
      case EDITOR_TABS.DATA:
        return JSON.stringify(data, null, 2);
      default:
        return null;
    }
  };

  const onClickAI = () => {
    const aiUrl = themeConfig?.ai?.url || 'https://sive.antv.antgroup.com/qa';
    window.open(aiUrl);
  };

  const onReload = () => {
    setApiCode(source);
    setSpecCode(null);
    // 重新执行 source 以重新生成 spec
    executeCode(source);
  };

  return (
    <div className={styles.editor} style={style}>
      <Toolbar
        fileExtension={fileExtension}
        sourceCode={getCodeForTab(currentEditorTab)}
        playground={playground}
        title={title}
        editorTabs={editorTabs}
        currentEditorTab={currentEditorTab}
        onExecuteCode={() => executeCode(getCodeForTab(currentEditorTab))}
        onEditorTabChange={onTabChange}
        onClickAI={onClickAI}
        showAI={showAI}
        onReload={onReload}
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
            path={`${tab}_${relativePath || exampleId}`}
            loading={<Loading style={{ height: 'calc(100vh - 128px)' }} />}
            options={{
              readOnly: tab === EDITOR_TABS.DATA,
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

export default CodeEditor;
