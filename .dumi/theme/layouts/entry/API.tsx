import React from 'react';
import { DocumentMenu } from '../../slots/DocumentMenu';
import { DocumentContent } from '../../slots/DocumentContent';
import { TOC } from '../../slots/TOC';

/**
 * API 路由下的入口
 * - 读取 API markdown 文件
 * - 渲染 UI
 */
export const API = () => {
  return (
    <>
      <DocumentMenu />
      <DocumentContent />
      <TOC />
    </>
  );
}
