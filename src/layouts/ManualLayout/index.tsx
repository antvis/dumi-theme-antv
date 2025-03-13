import React, { lazy, type PropsWithChildren } from 'react';
import InViewSuspense from '../../common/InViewSuspense';
import SEO from '../../common/SEO';
import { ManualContent } from '../../slots/ManualContent';

const Header = lazy(() => import('../../slots/Header'));
const Footer = lazy(() => import('../../slots/Footer'));

/**
 * Manual 路由下的入口
 */
const ManualLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <SEO />

      <InViewSuspense>
        <Header isHomePage={false} />
      </InViewSuspense>

      <ManualContent>{children}</ManualContent>

      <InViewSuspense>
        <Footer isDynamicFooter />
      </InViewSuspense>
    </>
  );
};

export default ManualLayout;
