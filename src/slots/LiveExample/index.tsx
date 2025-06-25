import { PlayCircleOutlined, PushpinOutlined } from '@ant-design/icons';
import SourceCodeEditor from 'dumi/theme-default/slots/SourceCodeEditor';
import { uniqueId } from 'lodash-es';
import { Language } from 'prism-react-renderer';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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

      // 清理容器并准备新的渲染
      clearContainer();
      const container = previewRef.current!;
      container.innerHTML = `<div id="${containerId}" style="width: 100%; height: 100%;"></div>`;

      // 生成唯一的执行ID并创建脚本
      const executionId = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const script = document.createElement('script');
      const modifiedCode = compiledCode.replace(/'container'|"container"/g, `'${containerId}'`);

      script.textContent = `
      try {
        ${modifiedCode}
        const successElement = document.createElement('div');
        successElement.id = 'execution-success-${executionId}';
        successElement.style.display = 'none';
        document.body.appendChild(successElement);
      } catch (error) {
        console.error('脚本执行时发生错误:', error);
        const errorElement = document.createElement('div');
        errorElement.id = 'execution-error-${executionId}';
        errorElement.textContent = error.message;
        errorElement.style.display = 'none';
        document.body.appendChild(errorElement);

        if (!${hasSuccessfulRender}) {
          const errorContainer = document.getElementById('${containerId}');
          if (errorContainer) {
            errorContainer.innerHTML = '<div style="color: #fb1716; padding: 8px; border-left: 3px solid #ff0000; padding-left: 12px;">Runtime Error: ' + error.message + '</div>';
          }
        }
      }
    `;

      document.head.appendChild(script);

      // 检查执行结果并清理
      setTimeout(() => {
        const successElement = document.getElementById(`execution-success-${executionId}`);
        const errorElement = document.getElementById(`execution-error-${executionId}`);

        if (successElement) {
          setHasSuccessfulRender(true);
          document.body.removeChild(successElement);
        } else if (errorElement) {
          const errorMsg = errorElement.textContent || 'Unknown error';
          if (hasSuccessfulRender) {
            console.error('LiveExample Runtime Error:', errorMsg);
          }
          document.body.removeChild(errorElement);
        }

        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      }, 100);
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
    execute(sourceCode);
  }, [execute, sourceCode]);

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

  return (
    <div className={styles.preview}>
      {executionState.isLoading ? (
        <div className={styles.loading}>Executing...</div>
      ) : (
        <>
          <div ref={previewRef} className={styles.main} />
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
