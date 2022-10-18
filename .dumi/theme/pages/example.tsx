import { useContext } from 'react';
import { Header } from '../slots/Header';
import { Footer } from '../slots/Footer';
import { ThemeAntVContext } from '../context';

/**
 * 404 页面
 */
export default () => {
  // 1. 在 plugin.ts 文件中，读取左边菜单列表，放入到 context 中
  // 2. 拿到数据，渲染页面
  console.log(useContext(ThemeAntVContext));
  return (
    <>
      <Header />
      <div>hello world!</div>
      <Footer />
    </>
  );
};
