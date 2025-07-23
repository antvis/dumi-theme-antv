/**
 * React Component Preview
 */
import { debounce } from 'lodash-es';
import React, { FC, useCallback, useEffect, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { compile } from '../CodeEditor/utils';

interface Props {
  code: string;
  refresh: number;
}

/**
 * 编译代码
 */
function compileCode(code: string): string {
  return compile(code, '', true);
}

/**
 * 构造 require
 * @param name
 * @returns
 */
function fakeRequire(name: string) {
  if (name === 'react') return (window as any).React;
  if (name === 'react-dom') return (window as any).ReactDOM;
  if ((window as any)[name]) return (window as any)[name];
  throw new Error(`require('${name}') 未被支持，请在 window 上挂载`);
}

/**
 * 执行模块，返回导出
 */
function executeModule(compiled: string): any {
  const moduleExports: any = {};
  const func = new Function('exports', 'module', 'require', 'React', 'ReactDOM', compiled);

  func(moduleExports, { exports: moduleExports }, fakeRequire, (window as any).React, (window as any).ReactDOM);
  return moduleExports.default || moduleExports;
}

/**
 * 判断是否为有效 React 组件
 */
function isReactComponent(Component: any): boolean {
  return typeof Component === 'function' || (Component && typeof Component.render === 'function');
}

/**
 * 渲染错误信息
 */
function renderError(ref: React.RefObject<HTMLDivElement>, msg: string) {
  if (ref.current) {
    ref.current.innerHTML = `<div style='color:red;'>React 渲染错误: ${msg}</div>`;
  }
}

const ReactPreview: FC<Props> = ({ code, refresh }) => {
  const ref = useRef<HTMLDivElement>(null);
  const rootRef = useRef<Root | null>(null);

  // 防抖渲染逻辑
  const debouncedRender = useCallback(
    debounce((code: string) => {
      if (!ref.current) return;

      if (!rootRef.current) {
        rootRef.current = createRoot(ref.current);
      }

      try {
        (window as any).define = undefined; // 临时禁用 define

        const compiled = compileCode(code);
        const Component = executeModule(compiled);
        if (isReactComponent(Component)) {
          rootRef.current.render(React.createElement(Component));
        } else {
          renderError(ref, '未监测到有效 React 组件，请用 <b>export default</b> 导出');
        }
      } catch (e) {
        renderError(ref, String(e));
      }
    }, 200),
    [],
  );

  useEffect(() => {
    debouncedRender(code);
  }, [code, debouncedRender, refresh]);

  useEffect(() => {
    return () => {
      if (rootRef.current) {
        rootRef.current.unmount();
        rootRef.current = null;
      }
    };
  }, []);

  return <div ref={ref} />;
};

export default ReactPreview;
