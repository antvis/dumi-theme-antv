import React from 'react';
import { Header } from '../../slots/Header';
import { Description } from '../../slots/Description';
import { News } from '../../slots/News';
import { Features } from '../../slots/Features';
import { Cases } from '../../slots/Cases';
import { Cooperation } from '../../slots/Cooperation';
import { Footer } from '../../slots/Footer';

/**
 * Index 路由下的入口
 * - 获取数据
 * - 组合 slots 下的木偶组件
 */
export const Index = () => {
  return (
    <>
      <Header />
      <Description />
      <News />
      <Features />
      <Cases />
      <Cooperation />
      <Footer />
    </>
  );
};
