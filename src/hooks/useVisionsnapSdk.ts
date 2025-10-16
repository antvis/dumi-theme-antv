import React, { useEffect, useState, useRef, useCallback } from 'react';

export interface IVisionsnapSdk {
  VisionCanvas: React.FC<{
    [key: string]: any;
  }>;
  VisionPreview: React.FC<{
    [key: string]: any;
  }>;
  VisionChat: React.FC<{
    [key: string]: any;
  }>;
}

interface IUseRemoteSdkResult<T> {
  sdk: T;
  loading: boolean;
}

// 扩展 Window 接口以支持动态属性访问
declare global {
  interface Window {
    [key: string]: any;
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
export function useRemoteComponent<T>(url: string, name: string): [T, boolean] {
  const [Component, setComponent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load(url, name);
  }, [url, name]);

  const clear = useInterval(() => {
    if (window[name]) {
      setComponent(window[name]);
      setLoading(false);
      clear();
    }
  }, 100);

  if (window?.[name]) {
    return [window[name], false];
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

  let jssdkCdnUrl = jssdkVersion.includes('dev')
    ? `https://g.alipay.com/${packageName}@${jssdkVersion}/${file}`
    : `https://gw.alipayobjects.com/render/p/yuyan_npm/${packageName.replace('/', '_')}/${jssdkVersion}/${file}`;

  return jssdkCdnUrl;
}

function useRemoteSdk<T>(options: JSSDKURLOptions): IUseRemoteSdkResult<T> {
  const { sdkInstanceName = 'sdk' } = options;

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

export const requestProxy = {
  getAuthToken: `https://www.weavefox.cn/api/visionsnap/auth_token`,
  getImportMaps: `https://www.weavefox.cn/api/visionsnap/import_maps`,
};
