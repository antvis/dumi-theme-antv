import { useOutlet, useLocation } from 'dumi';
import { Index } from './entry/Index';
import { API } from './entry/API';
import { Manual } from './entry/Manual';
import '../slots/_.less';
import Example from '../pages/Examples';
import ExampleContent from '../pages/Example';

/**
 * DocuLayout 是 dumi2 的内置 layout 入口，在这里使用页面路径进行区分成自己不同的 Layout。
 */
export default () => {
  const outlet = useOutlet();
  const { pathname } = useLocation();
  const p = pathname.toLowerCase();

  // // 首页
  if (p === '/' || p === '/en') return <Index />;

  // // API 页面（docs 是兼容之前的 URL）
  if (p.startsWith('/api') || p.startsWith('/en/api') || p.startsWith('/docs/en/api')) {
    return <API> {outlet} </API>
  }

  // 教程页面（docs 是兼容之前的 URL）
  if (p.startsWith('/manual') || p.startsWith('/en/manual') || p.startsWith('/docs/manual')) {
    return <Manual> {outlet} </Manual>;
  }

  if (p.startsWith('/examples/') || p.startsWith('/en/examples/') || p.startsWith('/docs/examples/')) {
    return <ExampleContent></ExampleContent>
  }

  if (p =='/examples' || p =='/en/examples' || p == '/docs/examples') {
    return <Example></Example>
  }

 
  // More router, add here...

  return outlet;
};
