import React from 'react';
import { useNavData, useSiteData } from 'dumi';
import { NotFoundPage } from './404';

/**
<>
  <Description />
  <News />
  <Features />
  <Cases />
  <Cooperation />
  <Footer />
<>

 */
export default (props) => {
  console.log(useNavData(), useSiteData());
  return <>
    Here is Content!
    <NotFoundPage />
  </>
};