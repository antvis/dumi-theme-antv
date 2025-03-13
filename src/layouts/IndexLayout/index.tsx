import React, { type PropsWithChildren } from 'react';
import Footer from '../../slots/Footer';
import Header from '../../slots/Header';

/**
 * 首页布局
 */
const IndexLayout: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  return (
    <>
      <Header />
      <div style={{ minHeight: '100vh' }}>{children}</div>
      <Footer />
    </>
  );
};

export default IndexLayout;
