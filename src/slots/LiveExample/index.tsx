import { PlayCircleOutlined, PushpinOutlined } from '@ant-design/icons';
import SourceCodeEditor from 'dumi/theme-default/slots/SourceCodeEditor';
import { uniqueId } from 'lodash-es';
import { Language } from 'prism-react-renderer';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { compile } from '../CodeEditor/utils';
import { safeEval } from '../ManualContent/utils';
import styles from './index.module.less';

interface PreviewOptions {
  /** Whether to inject code into DOM automatically */
  inject?: boolean;
  /** Whether to pin the code editor (show by default) */
  pin?: boolean;
}

interface LiveExampleProps extends PreviewOptions {
  /** The source code to be executed */
  source: string;
  /** The language of the source code */
  lang: Language;
  /** The lines to highlight in the code */
  highlightLines?: number[];
  /** The title of the example */
  title?: string;
}

interface ExecutionState {
  isLoading: boolean;
  error: string | null;
}

export default function LiveExample(props: LiveExampleProps) {
  const { source: initialSource, lang, inject = false, pin = true } = props;

  const previewRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLUListElement>(null);
  const reactRootRef = useRef<any>(null);

  const [sourceCode, setSourceCode] = useState(initialSource);
  const [executionState, setExecutionState] = useState<ExecutionState>({
    isLoading: false,
    error: null,
  });
  const [isCodeVisible, setIsCodeVisible] = useState(pin !== false);
  const [containerId] = useState(() => `live-example-${uniqueId()}`);
  const [hasSuccessfulRender, setHasSuccessfulRender] = useState(false);

  const clearContainer = useCallback(() => {
    if (previewRef.current) {
      previewRef.current.innerHTML = '';
    }
    // 清理 React root
    if (reactRootRef.current) {
      try {
        reactRootRef.current.unmount();
      } catch (error) {
        console.warn('Error unmounting React root:', error);
      }
      reactRootRef.current = null;
    }
  }, []);

  const handleError = useCallback(
    (message: string) => {
      if (hasSuccessfulRender) {
        console.error('LiveExample Error:', message);
      } else if (previewRef.current) {
        previewRef.current.innerHTML = `
        <div style="color: #fb1716; padding: 8px; border-left: 3px solid #ff0000; padding-left: 12px;">
          ${message}
        </div>
      `;
      }
    },
    [hasSuccessfulRender],
  );

  const renderResult = useCallback((value: any) => {
    const container = previewRef.current;
    if (!container) return;

    // 检查是否是 React 组件
    if (typeof value === 'function') {
      try {
        // 清理旧的 React root
        if (reactRootRef.current) {
          reactRootRef.current.unmount();
        }

        // 创建新的 React root
        const newRoot = createRoot(container);
        newRoot.render(React.createElement(value));
        reactRootRef.current = newRoot;
        return;
      } catch (error) {
        // 如果不是 React 组件，继续执行下面的逻辑
        console.warn('Failed to render as React component:', error);
      }
    }

    if (
      value instanceof HTMLElement ||
      value instanceof SVGElement ||
      (value && typeof value === 'object' && value.nodeType)
    ) {
      container.appendChild(value);
    } else if (value !== null && value !== undefined) {
      const div = document.createElement('div');
      div.textContent = String(value);
      container.appendChild(div);
    }
  }, []);

  // Inject模式：编译并注入代码
  const executeInjectMode = useCallback(
    (code: string) => {
      let compiledCode: string;
      try {
        compiledCode = compile(code, '', true);
      } catch (compileError) {
        const errorMessage = compileError instanceof Error ? compileError.message : String(compileError);
        handleError(`Compile Error: ${errorMessage}`);
        return;
      }

      // 清理容器
      clearContainer();
      const container = previewRef.current!;

      // 尝试直接执行代码并获取 React 组件
      try {
        // 创建一个安全的执行环境
        const moduleExports: any = {};
        const moduleContext = {
          exports: moduleExports,
          module: { exports: moduleExports },
          require: (name: string) => {
            if (name === 'react') return (window as any).React;
            if (name === 'react-dom') return (window as any).ReactDOM;
            if (name === '@antv/g2') return (window as any).g2;
            throw new Error(`Module ${name} not found`);
          },
          React: (window as any).React,
          ReactDOM: (window as any).ReactDOM,
          g2: (window as any).g2,
          console,
          window,
          document,
          setTimeout,
          setInterval,
          clearTimeout,
          clearInterval,
          requestAnimationFrame,
          cancelAnimationFrame,
        };

        // 执行编译后的代码
        const func = new Function(
          'exports', 'module', 'require', 'React', 'ReactDOM', 'g2', 'console', 'window', 'document',
          'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'requestAnimationFrame', 'cancelAnimationFrame',
          compiledCode
        );

        func.call(
          moduleContext,
          moduleExports,
          { exports: moduleExports },
          moduleContext.require,
          (window as any).React,
          (window as any).ReactDOM,
          (window as any).g2,
          console,
          window,
          document,
          setTimeout,
          setInterval,
          clearTimeout,
          clearInterval,
          requestAnimationFrame,
          cancelAnimationFrame
        );

        // 检查是否有默认导出的 React 组件
        const Component = moduleExports.default || moduleExports;

        if (typeof Component === 'function') {
          console.log('Found React component, rendering directly');

          // 直接渲染 React 组件
          if ((window as any).React && (window as any).ReactDOM) {
            // 清理旧的 React root
            if (reactRootRef.current) {
              reactRootRef.current.unmount();
            }

            // 创建新的 React root 并渲染组件
            const newRoot = (window as any).ReactDOM.createRoot(container);
            newRoot.render((window as any).React.createElement(Component));
            reactRootRef.current = newRoot;
            setHasSuccessfulRender(true);
            console.log('React component rendered successfully');
          } else {
            handleError('React or ReactDOM not available');
          }
        } else {
          // 如果不是 React 组件，使用传统的 DOM 注入方式
          container.innerHTML = `<div id="${containerId}" style="width: 100%; height: 100%;"></div>`;

          const script = document.createElement('script');
          const modifiedCode = compiledCode.replace(/'container'|"container"/g, `'${containerId}'`);

          script.textContent = `
            var __runnerDefine = window['define'];
            window['define'] = null;
            try {
              ${modifiedCode}
            } catch (error) {
              console.error('Script execution error:', error);
            } finally {
              window['define'] = __runnerDefine;
            }
          `;

          document.head.appendChild(script);

          // 清理脚本
          setTimeout(() => {
            if (script.parentNode) {
              script.parentNode.removeChild(script);
            }
          }, 100);

          setHasSuccessfulRender(true);
        }
      } catch (error) {
        console.error('Execution error:', error);
        handleError(`Execution Error: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
    [containerId, clearContainer, handleError, hasSuccessfulRender],
  );

  // Direct模式：直接执行代码
  const executeDirectMode = useCallback(
    (code: string) => {
      const executeAndRender = (result: any) => {
        clearContainer();
        renderResult(result);
        setHasSuccessfulRender(true);
      };

      try {
        const result = safeEval(code);

        if (result && typeof result.then === 'function') {
          result.then(executeAndRender).catch((error: any) => {
            handleError(`Promise Error: ${error.message || String(error)}`);
          });
        } else {
          executeAndRender(result);
        }
      } catch (error) {
        handleError(`Execution Error: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
    [clearContainer, renderResult, handleError],
  );

  const execute = useCallback(
    async (code: string) => {
      setExecutionState({ isLoading: true, error: null });

      if (inject) {
        executeInjectMode(code);
      } else {
        executeDirectMode(code);
      }

      setExecutionState({ isLoading: false, error: null });
    },
    [inject, executeInjectMode, executeDirectMode],
  );

  const updateToolbarHeight = useCallback(() => {
    if (!toolbarRef.current || !previewRef.current || !codeRef.current) return;
    const codeHeight = codeRef.current.clientHeight;
    const previewHeight = previewRef.current.clientHeight;
    toolbarRef.current.style.height = `${codeHeight + previewHeight}px`;
  }, []);

  const toggleCodeVisibility = useCallback(() => {
    const visible = !isCodeVisible;
    setIsCodeVisible(visible);
    if (codeRef.current) {
      codeRef.current.style.display = visible ? 'block' : 'none';
      setTimeout(updateToolbarHeight, 0);
    }
  }, [isCodeVisible, updateToolbarHeight]);

  const handleRunCode = useCallback(() => {
    execute(sourceCode);
  }, [execute, sourceCode]);

  const handleSourceChange = useCallback((code: string) => {
    setSourceCode(code);
  }, []);

  // Effects
  useEffect(() => {
    // 确保 DOM 元素已经挂载后再执行
    const timer = setTimeout(() => {
      if (previewRef.current) {
        execute(sourceCode);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [execute, sourceCode]);

  // 添加一个备用的延迟执行机制，防止首次渲染时执行失败
  useEffect(() => {
    const retryTimer = setTimeout(() => {
      if (previewRef.current && !hasSuccessfulRender) {
        execute(sourceCode);
      }
    }, 100);

    return () => clearTimeout(retryTimer);
  }, [execute, sourceCode, hasSuccessfulRender]);

  useEffect(() => {
    setTimeout(updateToolbarHeight, 100);
  }, [executionState, updateToolbarHeight]);

  useEffect(() => {
    if (!codeRef.current) return;
    if (pin === false) {
      codeRef.current.style.display = 'none';
      setIsCodeVisible(false);
    }
  }, [pin]);

  useEffect(() => {
    const handleMouseEnter = () => {
      if (!toolbarRef.current || !codeRef.current) return;
      toolbarRef.current.style.display = 'block';
      codeRef.current.style.borderRadius = '0px';
      setTimeout(updateToolbarHeight, 0);
    };

    const handleMouseLeave = () => {
      if (!toolbarRef.current || !codeRef.current) return;
      toolbarRef.current.style.display = '';
      codeRef.current.style.borderRadius = '';
    };

    const codeEditor = codeRef.current;
    const previewContainer = previewRef.current;

    codeEditor?.addEventListener('mouseenter', handleMouseEnter);
    codeEditor?.addEventListener('mouseleave', handleMouseLeave);
    previewContainer?.addEventListener('mouseenter', handleMouseEnter);
    previewContainer?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      codeEditor?.removeEventListener('mouseenter', handleMouseEnter);
      codeEditor?.removeEventListener('mouseleave', handleMouseLeave);
      previewContainer?.removeEventListener('mouseenter', handleMouseEnter);
      previewContainer?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [updateToolbarHeight]);

  // 组件卸载时清理 React root
  useEffect(() => {
    return () => {
      if (reactRootRef.current) {
        try {
          reactRootRef.current.unmount();
        } catch (error) {
          console.warn('Error unmounting React root on cleanup:', error);
        }
      }
    };
  }, []);

  return (
    <div className={styles.preview}>
      {executionState.isLoading ? (
        <div className={styles.loading}>Executing...</div>
      ) : (
        <>
          <div ref={previewRef} className={styles.main} data-live-example-container />
          <ul className={styles.ul} ref={toolbarRef}>
            <li onClick={toggleCodeVisibility} className={styles.li} title="Toggle Code Editor">
              <PushpinOutlined />
            </li>
            <li onClick={handleRunCode} className={styles.li} title="Run Code">
              <PlayCircleOutlined />
            </li>
          </ul>
        </>
      )}
      <div ref={codeRef} style={{ display: isCodeVisible ? 'block' : 'none' }}>
        <SourceCodeEditor onChange={handleSourceChange} initialValue={sourceCode} lang={lang} />
      </div>
    </div>
  );
}
