/**
 * IIFE Preview
 */
import { debounce } from 'lodash-es';
import React, { FC, useCallback, useEffect, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { safeEval } from '../ManualContent/utils';

interface IIFEPreviewProps {
  code: string;
  refresh: number;
}

/**
 * 渲染错误信息
 */
function renderError(ref: React.RefObject<HTMLDivElement>, msg: string) {
  if (ref.current) {
    ref.current.innerHTML = `<div style='color:red;'>IIFE 执行错误: ${msg}</div>`;
  }
}

/**
 * 渲染 IIFE 结果
 */
function renderIIFEResultSync(
  ref: React.RefObject<HTMLDivElement>,
  rootRef: React.MutableRefObject<Root | null>,
  val: any,
) {
  if (!ref.current) return;
  if (val instanceof HTMLElement) {
    ref.current.appendChild(val);
  } else if (typeof val === 'string') {
    ref.current.innerHTML = val;
  } else if (React.isValidElement(val)) {
    if (!rootRef.current) rootRef.current = createRoot(ref.current);
    rootRef.current.render(val);
  } else if (val !== undefined && val !== null) {
    ref.current.innerHTML = `<pre>${JSON.stringify(val)}</pre>`;
  } else {
    ref.current.innerHTML = `<div style='color:red;'>IIFE 未返回 DOM 节点</div>`;
  }
}

/**
 * 执行 IIFE 代码
 */
function executeIIFE(code: string, ref: React.RefObject<HTMLDivElement>, rootRef: React.MutableRefObject<Root | null>) {
  if (!ref.current) return;

  ref.current.innerHTML = '';

  try {
    const result = safeEval(code);

    if (result && typeof result.then === 'function') {
      result
        .then((val: any) => renderIIFEResultSync(ref, rootRef, val))
        .catch((e: any) => {
          renderError(ref, `Promise 执行错误: ${e}`);
        });
    } else {
      renderIIFEResultSync(ref, rootRef, result);
    }
  } catch (e) {
    renderError(ref, String(e));
  }
}

const IIFEPreview: FC<IIFEPreviewProps> = ({ code, refresh }) => {
  const ref = useRef<HTMLDivElement>(null);
  const rootRef = useRef<Root | null>(null);

  const debouncedRender = useCallback(
    debounce((code: string) => {
      executeIIFE(code, ref, rootRef);
    }, 200),
    [],
  );

  useEffect(() => {
    debouncedRender(code);
  }, [code, refresh, debouncedRender]);

  useEffect(() => {
    return () => {
      if (rootRef.current) {
        rootRef.current.unmount();
        rootRef.current = null;
      }
      if (ref.current) {
        ref.current.innerHTML = '';
      }
    };
  }, []);

  return <div ref={ref} />;
};

export default IIFEPreview;
