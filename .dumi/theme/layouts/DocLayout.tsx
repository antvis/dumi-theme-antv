import { useOutlet } from 'dumi';
import { Index } from './entry/Index';
import { API } from './entry/API';
import { Tutorial } from './entry/Tutorial';
import { ExampleGallery } from './entry/ExampleGallery';

import '../slots/_.less';

/**
 * DocuLayout 是 dumi2 的内置 layout 入口，在这里使用页面路径进行区分成自己不同的 Layout。
 */
export default () => {
  const outlet = useOutlet();
  const { pathname } = location;
  const p = pathname.toLowerCase();

  if (p === '/') return <Index />;
  if (p === '/api') return <API />;
  if (p === '/example/gallery') return <ExampleGallery />;
  if (p === '/tutorial') return <Tutorial />;
  // More router, add here...

  return outlet;
};
