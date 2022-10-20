import { useOutlet, useLocation, useSidebarData } from 'dumi';
import { Index } from './entry/Index';
import { API } from './entry/API';
import { Manual } from './entry/Manual';
import { ExampleGallery } from './entry/ExampleGallery';
import { Header } from '../slots/Header';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import '../slots/_.less';



i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    initImmediate: false,
    fallbackLng: 'zh',
    keySeparator: false,
    react: {
      useSuspense: false,
    },
  });


const lngs = ['zh', 'en'];

/**
 * DocuLayout 是 dumi2 的内置 layout 入口，在这里使用页面路径进行区分成自己不同的 Layout。
 */
export default () => {
  const outlet = useOutlet();
  const { pathname } = useLocation();
  const p = pathname.toLowerCase();

  // // 首页
  if (p === '/') return <Index />;

  // // API 页面（docs 是兼容之前的 URL）
  if (p.startsWith('/api') || p.startsWith('/docs/api/')) {
    return <API> {outlet} </API>
  }

  // 教程页面（docs 是兼容之前的 URL）
  if (p.startsWith('/manual/') || p.startsWith('/docs/manual/')) {
    return <Manual> {outlet} </Manual>;
  }

  // More router, add here...

  return outlet;
};
