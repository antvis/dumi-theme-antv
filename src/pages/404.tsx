import React from 'react';
import CommonHelmet from '../common/CommonHelmet';
import { NotFound as NotFoundPage } from '../slots/404';
import Footer from '../slots/Footer';
import Header from '../slots/Header';

/**
 * 404 页面
 */
const NotFound = () => (
  <>
    <CommonHelmet title="404: Not found" />
    <Header isHomePage={false} />
    <NotFoundPage />
    <Footer />
  </>
);

export default NotFound;
