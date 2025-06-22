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

interface ExecutionResult {
  isLoading: boolean;
  error: Error | null;
  renderedNode: RenderableNode | null;
}

type RenderableNode = (HTMLElement | SVGElement) & {
  clear?: () => void;
  _eventCleanup?: () => void;
};

const normalizeAsyncValue = (value: any): Promise<any> => (value instanceof Promise ? value : Promise.resolve(value));

const createDOMNode = (value: any): RenderableNode => {
  if (value instanceof HTMLElement || value instanceof SVGElement) {
    const wrapper = document.createElement('div') as RenderableNode;
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    wrapper.appendChild(value);

    wrapper.clear = () => {
      if (typeof (value as any).clear === 'function') {
        (value as any).clear();
      }
    };
    return wrapper;
  }

  const span = document.createElement('span') as RenderableNode;
  span.textContent = String(value);
  return span;
};

/**
 * Calculates the actual size of an element
 */
const calculateElementSize = (element: HTMLElement) => {
  const computedStyle = getComputedStyle(element);
  return {
    width: element.clientWidth || parseInt(computedStyle.width) || 0,
    height: element.clientHeight || parseInt(computedStyle.height) || 0,
  };
};

const safelyCleanContainer = (container: HTMLElement) => {
  try {
    container.innerHTML = '';
  } catch {
    try {
      while (container.firstChild) container.removeChild(container.firstChild);
    } catch {}
  }
};

export default function LiveExample(props: LiveExampleProps) {
  const { source: initialSource, lang, inject = false, pin = true } = props;

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const codeEditorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLUListElement>(null);
  const currentNodeRef = useRef<RenderableNode | null>(null);

  const [sourceCode, setSourceCode] = useState(initialSource);
  const [executionResult, setExecutionResult] = useState<ExecutionResult>({
    isLoading: false,
    error: null,
    renderedNode: null,
  });
  const [isCodeVisible, setIsCodeVisible] = useState(pin !== false);
  const [containerId] = useState(() => `live-example-container-${uniqueId()}`);

  /**
   * Executes compiled code by injecting it into the DOM
   * This is used for inject mode where code needs to run in the browser context
   */
  const executeCompiledScript = useCallback(
    (compiledCode: string, scriptId: string): HTMLDivElement | null => {
      if (!previewContainerRef.current) return null;

      safelyCleanContainer(previewContainerRef.current);

      const scriptContainer = document.createElement('div');
      scriptContainer.id = scriptId;
      scriptContainer.innerHTML = `<div id="${containerId}" class="playgroundCodeContainer" style="width: 100%; height: 100%"></div>`;

      previewContainerRef.current.appendChild(scriptContainer);

      const scriptElement = document.createElement('script');
      const modifiedCode = compiledCode.replace(/'container'|"container"/g, `'${containerId}'`);
      scriptElement.innerHTML = modifiedCode;
      scriptContainer.appendChild(scriptElement);

      return scriptContainer;
    },
    [containerId],
  );

  const execute = useCallback(
    async (code: string) => {
      setExecutionResult({ isLoading: true, error: null, renderedNode: null });

      try {
        let resultNode: RenderableNode | null = null;

        if (inject) {
          // DOM injection mode: compile and execute code in browser context
          const compiledCode = compile(code, '', true);
          const scriptId = `script-${uniqueId()}`;
          resultNode = executeCompiledScript(compiledCode, scriptId);
        } else {
          // Direct evaluation mode: execute code and handle results
          const evaluationResult = safeEval(code);
          // Handle both sync and async results consistently
          const resolved = await normalizeAsyncValue(evaluationResult);
          resultNode = createDOMNode(resolved);
        }

        setExecutionResult({
          isLoading: false,
          error: null,
          renderedNode: resultNode,
        });
      } catch (error) {
        setExecutionResult({
          isLoading: false,
          error: error as Error,
          renderedNode: null,
        });
      }
    },
    [inject, executeCompiledScript],
  );

  const updateToolbarHeight = useCallback(() => {
    if (!toolbarRef.current || !previewContainerRef.current || !codeEditorRef.current) return;

    const codeSize = calculateElementSize(codeEditorRef.current);
    const previewSize = calculateElementSize(previewContainerRef.current);
    toolbarRef.current.style.height = `${codeSize.height + previewSize.height}px`;
  }, []);

  const toggleCodeVisibility = useCallback(() => {
    const visible = !isCodeVisible;
    setIsCodeVisible(visible);

    if (codeEditorRef.current) {
      codeEditorRef.current.style.display = visible ? 'block' : 'none';
      setTimeout(updateToolbarHeight, 0);
    }
  }, [isCodeVisible, updateToolbarHeight]);

  const handleRunCode = useCallback(() => {
    execute(sourceCode);
  }, [execute, sourceCode]);

  const handleSourceChange = useCallback((code: string) => {
    setSourceCode(code);
  }, []);

  useEffect(() => {
    execute(sourceCode);
  }, [sourceCode, execute]);

  useEffect(() => {
    if (!executionResult.renderedNode || inject) return;

    if (currentNodeRef.current) {
      currentNodeRef.current._eventCleanup?.();
      currentNodeRef.current.clear?.();
    }

    currentNodeRef.current = executionResult.renderedNode;

    if (previewContainerRef.current) {
      safelyCleanContainer(previewContainerRef.current);
      previewContainerRef.current.appendChild(executionResult.renderedNode);

      const handleMouseEnter = () => {
        if (!toolbarRef.current || !codeEditorRef.current) return;
        toolbarRef.current.style.display = 'block';
        codeEditorRef.current.style.borderRadius = '0px';
        setTimeout(updateToolbarHeight, 0);
      };

      const handleMouseLeave = () => {
        if (!toolbarRef.current || !codeEditorRef.current) return;
        toolbarRef.current.style.display = '';
        codeEditorRef.current.style.borderRadius = '';
      };

      executionResult.renderedNode.addEventListener('mouseenter', handleMouseEnter);
      executionResult.renderedNode.addEventListener('mouseleave', handleMouseLeave);

      executionResult.renderedNode._eventCleanup = () => {
        executionResult.renderedNode.removeEventListener('mouseenter', handleMouseEnter);
        executionResult.renderedNode.removeEventListener('mouseleave', handleMouseLeave);
      };
    }

    setTimeout(updateToolbarHeight, 0);
  }, [executionResult.renderedNode, inject, updateToolbarHeight]);

  useEffect(() => {
    if (!executionResult.renderedNode || !inject) return;
    setTimeout(updateToolbarHeight, 0);
  }, [executionResult.renderedNode, inject, updateToolbarHeight]);

  useEffect(() => {
    if (!codeEditorRef.current) return;
    if (pin === false) {
      codeEditorRef.current.style.display = 'none';
      setIsCodeVisible(false);
    }
  }, [pin]);

  useEffect(() => {
    const handleMouseEnter = () => {
      if (!toolbarRef.current || !codeEditorRef.current) return;
      toolbarRef.current.style.display = 'block';
      codeEditorRef.current.style.borderRadius = '0px';
      setTimeout(updateToolbarHeight, 0);
    };

    const handleMouseLeave = () => {
      if (!toolbarRef.current || !codeEditorRef.current) return;
      toolbarRef.current.style.display = '';
      codeEditorRef.current.style.borderRadius = '';
    };

    codeEditorRef.current?.addEventListener('mouseenter', handleMouseEnter);
    codeEditorRef.current?.addEventListener('mouseleave', handleMouseLeave);

    previewContainerRef.current?.addEventListener('mouseenter', handleMouseEnter);
    previewContainerRef.current?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      codeEditorRef.current?.removeEventListener('mouseenter', handleMouseEnter);
      codeEditorRef.current?.removeEventListener('mouseleave', handleMouseLeave);

      previewContainerRef.current?.removeEventListener('mouseenter', handleMouseEnter);
      previewContainerRef.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [updateToolbarHeight]);

  useEffect(() => {
    return () => {
      if (currentNodeRef.current) {
        currentNodeRef.current._eventCleanup?.();
        currentNodeRef.current.clear?.();
      }
    };
  }, []);

  return (
    <div className={styles.preview}>
      {executionResult.isLoading ? (
        <div className={styles.loading}>Executing...</div>
      ) : (
        <>
          <div ref={previewContainerRef} className={styles.main}>
            {executionResult.error && (
              <span className={styles.error}>{executionResult.error.message || executionResult.error.toString()}</span>
            )}
          </div>
          <ul className={styles.ul} ref={toolbarRef}>
            <li onClick={toggleCodeVisibility} className={styles.li} title="Toggle code visibility">
              <PushpinOutlined />
            </li>
            <li onClick={handleRunCode} className={styles.li} title="Run code">
              <PlayCircleOutlined />
            </li>
          </ul>
        </>
      )}
      <div ref={codeEditorRef} style={{ display: isCodeVisible ? 'block' : 'none' }}>
        <SourceCodeEditor onChange={handleSourceChange} initialValue={sourceCode} lang={lang} />
      </div>
    </div>
  );
}
