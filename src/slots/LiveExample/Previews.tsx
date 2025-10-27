import { debounce, uniqueId, type DebouncedFunc } from 'lodash-es';
import { default as React } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { compile } from '../CodeEditor/utils';
import { safeEval } from '../ManualContent/utils';

export interface BasePreviewProps {
  code: string;
  refresh: number;
}

export abstract class BasePreview<P extends BasePreviewProps = BasePreviewProps, S = {}> extends React.Component<P, S> {
  abstract errorMessage: string;

  protected ref = React.createRef<HTMLDivElement>();

  protected rootRef: Root | null = null;

  private debouncedDoRender: DebouncedFunc<() => void>;

  private debounceTime = 300;

  constructor(props: P) {
    super(props);
    this.debouncedDoRender = debounce(this.doRender.bind(this), this.debounceTime);
  }

  public abstract doRender(): void;

  public renderError(msg: string) {
    if (this.ref.current) {
      const message = this.errorMessage ? `${this.errorMessage}: ${msg}` : msg;
      this.ref.current.innerHTML = `<div style='color:red;'>${message}</div>`;
    }
  }

  componentDidMount() {
    this.debouncedDoRender();
  }

  componentDidUpdate(prevProps: BasePreviewProps) {
    if (prevProps.code !== this.props.code || prevProps.refresh !== this.props.refresh) {
      this.debouncedDoRender();
    }
  }

  componentWillUnmount() {
    this.debouncedDoRender.cancel();
    if (this.rootRef) {
      this.rootRef.unmount();
      this.rootRef = null;
    }
    if (this.ref.current) this.ref.current.innerHTML = '';
  }

  render() {
    return <div ref={this.ref} />;
  }
}

export class ReactPreview extends BasePreview<BasePreviewProps> {
  errorMessage = 'React 渲染错误';

  public doRender() {
    if (!this.ref.current) return;
    if (!this.rootRef) this.rootRef = createRoot(this.ref.current);
    const prevDefine = (window as any).define;
    try {
      (window as any).define = undefined;
      const compiled = compile(this.props.code, '', true);
      const moduleExports: any = {};

      const fakeRequire = (name: string) => {
        if (name === 'react') return (window as any).React;
        if (name === 'react-dom') return (window as any).ReactDOM;
        if ((window as any)[name]) return (window as any)[name];
        throw new Error(`require('${name}') 未被支持，请在 window 上挂载`);
      };

      const func = new Function('exports', 'module', 'require', 'React', 'ReactDOM', compiled);
      func(moduleExports, { exports: moduleExports }, fakeRequire, (window as any).React, (window as any).ReactDOM);
      const Component = moduleExports.default || moduleExports;
      if (typeof Component === 'function' || React.isValidElement(Component)) {
        this.rootRef.render(React.createElement(Component));
      } else {
        this.renderError('未监测到有效 React 组件，请用 <b>export default</b> 导出');
      }
    } catch (e) {
      this.renderError(String(e));
    } finally {
      (window as any).define = prevDefine;
    }
  }
}

export class ChartPreview extends BasePreview<BasePreviewProps> {
  errorMessage = '图表渲染错误';

  containerId = `live-chart-${uniqueId()}`;

  public doRender() {
    if (!this.ref.current) return;
    this.ref.current.innerHTML = `<div id="${this.containerId}"></div>`;
    const prevDefine = (window as any).define;
    try {
      (window as any).define = undefined;
      const compiled = compile(this.props.code, '', true);
      const script = document.createElement('script');
      script.textContent = compiled.replace(/'container'|"container"/g, `'${this.containerId}'`);
      document.body.appendChild(script);
      setTimeout(() => {
        if (script.parentNode) script.parentNode.removeChild(script);
      }, 100);
    } catch (e) {
      this.renderError(String(e));
    } finally {
      (window as any).define = prevDefine;
    }
  }
}

export class IIFEPreview extends BasePreview<BasePreviewProps> {
  errorMessage = 'IIFE 执行错误';

  private renderIIFEResult(result: any) {
    if (!this.ref.current) return;
    if (result instanceof HTMLElement) {
      this.ref.current.appendChild(result);
    } else if (typeof result === 'string') {
      this.ref.current.innerHTML = result;
    } else if (React.isValidElement(result)) {
      if (!this.rootRef) this.rootRef = createRoot(this.ref.current);
      this.rootRef.render(result);
    } else if (result !== undefined && result !== null) {
      this.ref.current.innerHTML = `<div>${JSON.stringify(result)}</div>`;
    } else {
      this.renderError('IIFE 未返回 DOM 节点');
    }
  }

  public doRender() {
    if (!this.ref.current) return;
    this.ref.current.innerHTML = '';
    try {
      const result = safeEval(this.props.code);

      if (result && typeof result.then === 'function') {
        result
          .then((val: any) => this.renderIIFEResult(val))
          .catch((e: any) => {
            this.renderError(`Promise 执行错误: ${e}`);
          });
      } else {
        this.renderIIFEResult(result);
      }
    } catch (e) {
      this.renderError(String(e));
    }
  }
}

export class PurePreview extends BasePreview<BasePreviewProps> {
  errorMessage = 'JS 执行错误';

  public doRender() {
    if (!this.ref.current) return;
    this.ref.current.innerHTML = '';
    try {
      const result = Function('return (function(){ with (window) { return ' + this.props.code + ' } })')()();
      if (result instanceof HTMLElement) {
        this.ref.current.appendChild(result);
      } else if (typeof result === 'string') {
        this.ref.current.innerHTML = result;
      } else if (result !== undefined && result !== null) {
        this.ref.current.innerHTML = `<div>${JSON.stringify(result)}</div>`;
      } else {
        this.renderError('未返回有效结果');
      }
    } catch (e) {
      this.renderError(String(e));
    }
  }
}
