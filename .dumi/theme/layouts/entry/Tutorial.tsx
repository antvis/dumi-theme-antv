import React from 'react';
import { ExampleMenu } from '../../slots/ExampleMenu';
import { DocumentContent } from '../../slots/DocumentContent';
import { TOC } from '../../slots/TOC';

/**
 * Tutorial 路由下的入口
 */
export const Tutorial = () => {
  return (
    <>
      <ExampleMenu />
      <DocumentContent />
      <TOC />
    </>
  );
}
