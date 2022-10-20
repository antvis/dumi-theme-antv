import React from 'react';
import { Manual } from './Manual';

export type APIProps = {
  readonly children: any;
}


/**
 * API 路由下的入口
 * - 读取 API markdown 文件
 * - 渲染 UI
 */
export const API: React.FC<APIProps> = ({ children }) => {
  return (
    <Manual>
      { children }
    </Manual>
  );
}




