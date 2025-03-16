import { Layout } from 'antd';
import { useRouteMeta } from 'dumi';
import React, { type PropsWithChildren } from 'react';
import CommonHelmet from '../../common/CommonHelmet';
import styles from './index.module.less';
import { Main } from './Main';
import { Sidebar } from './Sidebar';

export const ManualContent: React.FC<PropsWithChildren> = ({ children }) => {
  const meta = useRouteMeta();
  const { title, description } = meta.frontmatter;

  return (
    <Layout hasSider className={styles.layout}>
      <CommonHelmet title={title} description={description} />
      <Sidebar />
      <Main>{children}</Main>
    </Layout>
  );
};
