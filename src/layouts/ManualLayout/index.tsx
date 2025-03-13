import React, { type PropsWithChildren } from 'react';
import Footer from '../../slots/Footer';
import Header from '../../slots/Header';
import { ManualContent } from '../../slots/ManualContent';

/**
 * Manual 路由下的入口
 */
const ManualLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header isHomePage={false} />
      <ManualContent>{children}</ManualContent>
      <Footer isDynamicFooter />
    </>
  );
};

export default ManualLayout;
