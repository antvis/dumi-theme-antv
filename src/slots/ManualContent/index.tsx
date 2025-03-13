import { Layout } from 'antd';
import React, { type PropsWithChildren } from 'react';
import CommonHelmet from '../../common/CommonHelmet';
import styles from './index.module.less';
import { Main } from './Main';
import { Sidebar } from './Sidebar';

export const ManualContent: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Layout hasSider className={styles.layout}>
      <CommonHelmet />
      <Sidebar />
      <Main>{children}</Main>
    </Layout>
  );
};
