import React, { useEffect, useState, useRef, useCallback } from 'react';
import * as ReactDOMClient from 'react-dom/client';
import * as ReactDOM from 'react-dom';

// 将 React 暴露到全局作用域，供第三方 SDK 使用
declare global {
  interface Window {
    React: typeof React
    ReactDOM: typeof ReactDOM & {
      createRoot: typeof ReactDOMClient.createRoot
      hydrateRoot: typeof ReactDOMClient.hydrateRoot
    }
  }
}

// 只有在全局 React 不存在时才设置
if (typeof window !== 'undefined') {
  if (!window.React) {
    window.React = React
  }
  if (!window.ReactDOM) {
    // 合并 ReactDOM 和 ReactDOMClient 的功能，确保新的 API 来自正确的模块
    window.ReactDOM = {
      ...ReactDOM,
      // 明确从 react-dom/client 导入新的 API
      createRoot: ReactDOMClient.createRoot,
      hydrateRoot: ReactDOMClient.hydrateRoot,
    }
  }
}


export interface IVisionsnapSdk {
  VisionCanvas: React.FC<{
    [key: string]: unknown;
  }>;
  VisionPreview: React.FC<{
    [key: string]: unknown;
  }>;
  VisionChat: React.FC<{
    [key: string]: unknown;
  }>;
}

interface IUseRemoteSdkResult<T> {
  sdk: T | null;
  loading: boolean;
}

// 扩展 Window 接口以支持动态属性访问
declare global {
  interface Window {
    [key: string]: unknown;
  }
}

/**
 * 自定义 useInterval hook，用于轮询检查远程组件是否加载完成
 * @param callback 回调函数
 * @param delay 轮询间隔时间（毫秒）
 * @returns 清除定时器的函数
 */
function useInterval(callback: () => void, delay: number): () => void {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const savedCallback = useRef<() => void>();

  // 保存最新的回调函数
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // 清除定时器的函数，使用 useCallback 优化性能
  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // 设置和清理定时器
  useEffect(() => {
    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };

    intervalRef.current = setInterval(tick, delay);

    return clear;
  }, [delay, clear]);

  return clear;
}

function load(url: string, name: string) {
  const id = `__umd_component__${name}_`;
  if (document.getElementById(id)) {
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = url;
  script.id = id;
  script.crossOrigin = 'anonymous';
  // attach it to DOM
  document.body.appendChild(script);
}

/**
 * a hook to use Remote React Component.
 * @param url component CDN url
 * @param name global name
 * @return global variable
 */
export function useRemoteComponent<T>(url: string, name: string): [T | null, boolean] {
  const [Component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load(url, name);
  }, [url, name]);

  const clear = useInterval(() => {
    if (window[name]) {
      setComponent(window[name] as T);
      setLoading(false);
      clear();
    }
  }, 100);

  if (window?.[name]) {
    return [window[name] as T, false];
  }

  return [Component, loading];
}

interface JSSDKURLOptions {
  packageName: string;
  version: string;
  sdkInstanceName?: string;
  file?: string;
}

function getJSSDKURL(options: JSSDKURLOptions): string {
  const { packageName, version, file = 'dist/sdk.js' } = options;
  const jssdkVersion = version;

  const jssdkCdnUrl = jssdkVersion.includes('dev')
    ? `https://g.alipay.com/${packageName}@${jssdkVersion}/${file}`
    : `https://gw.alipayobjects.com/render/p/yuyan_npm/${packageName.replace('/', '_')}/${jssdkVersion}/${file}`;

  return jssdkCdnUrl;
}

function useRemoteSdk<T>(options: JSSDKURLOptions): IUseRemoteSdkResult<T> {
  const { sdkInstanceName = 'sdk' } = options;

  // dev 版本只能走 g.alipay.com 域名，外网千万不能配
  const jssdkCdnUrl = getJSSDKURL(options);
  const [sdk, sdkLoading] = useRemoteComponent<T>(jssdkCdnUrl, sdkInstanceName);

  return {
    sdk,
    loading: sdkLoading,
  };
}

export function useVisionsnapSdk(visionsnapVersion: string) {
  return useRemoteSdk<IVisionsnapSdk>({
    packageName: '@alipay/visionsnap-client',
    version: visionsnapVersion,
    sdkInstanceName: 'VisionSnapSDK',
    file: 'dist/sdk.js',
  });
}
