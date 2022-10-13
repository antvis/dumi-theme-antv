import React from 'react';
import { useSiteData } from 'dumi';
import { Index } from './entry/Index';
import { API } from './entry/API';
import { Example } from './entry/Example';
import { Tutorial } from './entry/Tutorial';
import { ExampleGallery } from './entry/ExampleGallery';
import { NotFound } from './entry/404';

/**
 * DocuLayout 是 dumi2 的内置 layout 入口，在这里使用页面路径进行区分成自己不同的 Layout。
 */
export default () => {
  const { pathname } = location;
  const p = pathname.toLowerCase();

  console.log(useSiteData());

  if (p === '/') return <Index />;
  if (p === '/api') return <API />;
  if (p === '/examples') return <Example />;
  if (p === '/examples/gallery') return <ExampleGallery />;
  if (p === '/tutorials') return <Tutorial />;
  // More router, add here...

  return <NotFound />;
};
