import React, { FC, useCallback, useEffect, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';

interface PurePreviewProps {
  code: string;
  refresh: number;
}

/**
 * 渲染错误信息
 */
function renderError(ref: React.RefObject<HTMLDivElement>, msg: string) {
  if (ref.current) {
    ref.current.innerHTML = `<div style='color:red;'>表达式执行错误: ${msg}</div>`;
  }
}

/**
 * 渲染表达式结果
 */
function renderResult(ref: React.RefObject<HTMLDivElement>, rootRef: React.MutableRefObject<Root | null>, val: any) {
  if (!ref.current) return;
  if (val instanceof HTMLElement) {
    ref.current.appendChild(val);
  } else if (typeof val === 'string') {
    ref.current.innerHTML = val;
  } else if (React.isValidElement(val)) {
    if (!rootRef.current) rootRef.current = createRoot(ref.current);
    rootRef.current.render(val);
  } else if (val !== undefined && val !== null) {
    ref.current.innerHTML = `<div>${JSON.stringify(val)}</div>`;
  } else {
    renderError(ref, '表达式未返回有效结果');
  }
}

/**
 * 执行表达式
 */
function execute(code: string, ref: React.RefObject<HTMLDivElement>, rootRef: React.MutableRefObject<Root | null>) {
  if (!ref.current) return;
  ref.current.innerHTML = '';
  try {
    // 用 with(window) 支持全局函数
    const result = Function('return (function(){ with (window) { return ' + code + ' } })')()();
    if (result && typeof result.then === 'function') {
      result
        .then((val: any) => renderResult(ref, rootRef, val))
        .catch((e: any) => {
          renderError(ref, `Promise 执行错误: ${e}`);
        });
    } else {
      renderResult(ref, rootRef, result);
    }
  } catch (e) {
    renderError(ref, String(e));
  }
}

const PurePreview: FC<PurePreviewProps> = ({ code, refresh }) => {
  const ref = useRef<HTMLDivElement>(null);
  const rootRef = useRef<Root | null>(null);

  const doRender = useCallback(() => {
    execute(code, ref, rootRef);
  }, [code]);

  useEffect(() => {
    doRender();
  }, [doRender, refresh]);

  useEffect(() => {
    return () => {
      if (rootRef.current) {
        rootRef.current.unmount();
        rootRef.current = null;
      }
      if (ref.current) ref.current.innerHTML = '';
    };
  }, []);

  return <div ref={ref} />;
};

export default PurePreview;
