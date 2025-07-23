import { debounce, uniqueId } from 'lodash-es';
import React, { FC, useCallback, useEffect, useRef } from 'react';
import { compile } from '../CodeEditor/utils';

interface ChartPreviewProps {
  code: string;
  refresh: number;
}

/**
 * 渲染错误信息
 */
function renderError(ref: React.RefObject<HTMLDivElement>, msg: string) {
  if (ref.current) {
    ref.current.innerHTML = `<div style='color:red;'>JS 执行错误: ${msg}</div>`;
  }
}

/**
 * 执行 JS 脚本并渲染
 */
function executeChartScript(
  code: string,
  ref: React.RefObject<HTMLDivElement>,
  containerId: React.MutableRefObject<string>,
) {
  if (!ref.current) return;
  ref.current.innerHTML = `<div id="${containerId.current}"></div>`;
  try {
    const compiled = compile(code, '', true);

    const script = document.createElement('script');
    script.textContent = compiled.replace(/'container'|"container"/g, `'${containerId.current}'`);
    document.body.appendChild(script);

    setTimeout(() => {
      if (script.parentNode) script.parentNode.removeChild(script);
    }, 100);
  } catch (e) {
    renderError(ref, String(e));
  }
}

const ChartPreview: FC<ChartPreviewProps> = ({ code, refresh }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerId = useRef(`live-chart-${uniqueId()}`);

  const debouncedRender = useCallback(
    debounce((code: string) => {
      executeChartScript(code, ref, containerId);
    }, 200),
    [],
  );

  useEffect(() => {
    debouncedRender(code);
  }, [code, refresh, debouncedRender]);

  useEffect(() => {
    return () => {
      if (ref.current) {
        ref.current.innerHTML = '';
      }
    };
  }, []);

  return <div ref={ref} />;
};

export default ChartPreview;
