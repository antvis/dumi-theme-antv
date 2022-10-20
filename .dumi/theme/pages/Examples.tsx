import { useContext } from 'react';
import { Header } from '../slots/Header';
import { Footer } from '../slots/Footer';
import { ThemeAntVContext } from '../context';
import { ExampleList } from '@/.dumi/theme/slots/ExampleList';

/**
 * Examples 页面
 *
 * @author YuZhanglong <loveyzl1123@gmail.com>
 */
const Example = () => {
  console.log(useContext(ThemeAntVContext));
  return (
    <>
      <Header isHomePage={false} />
      <ExampleList />
      <Footer />
    </>
  );
};

export default Example;
