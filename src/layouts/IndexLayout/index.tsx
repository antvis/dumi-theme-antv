import React from 'react';
import Footer from '../../slots/Footer';
import Header from '../../slots/Header';

const IndexLayout = (props) => {
  const { children } = props;
  return (
    <div>
      <Header />
      <div style={{ minHeight: '100vh' }}>{children}</div>
      <Footer />
    </div>
  );
};

export default IndexLayout;
