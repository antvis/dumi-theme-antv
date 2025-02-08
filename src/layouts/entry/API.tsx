import React, { PropsWithChildren } from 'react';
import { Manual } from './Manual';

/**
 * API 路由下的入口
 * - 读取 API markdown 文件
 * - 渲染 UI
 */
export const API: React.FC<PropsWithChildren> = ({ children }) => {
  return <Manual>{children}</Manual>;
};
