import React from 'react';
import { ExampleMenu } from '../../slots/ExampleMenu';
import { CodePreview } from '../../slots/CodePreview';

/**
 * Example 路由下的入口
 */
export const Example = () => {
  return (
    <>
      <ExampleMenu />
      <CodePreview />
    </>
  );
}
