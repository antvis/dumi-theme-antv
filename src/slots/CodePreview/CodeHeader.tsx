import React from 'react';
import { PageHeader, Tooltip, Space, Divider } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import { useT } from '../hooks';
import { getGithubSourceUrl } from '../utils';

import styles from './CodeHeader.module.less';


export type CodeHeaderProps = {
  /**
   * 代码的标题
   */
  title: string;
  /**
   * 代码的路径
   */
  relativePath: string;
  /**
   * GitHub 的地址，用于拼接最后 GitHub 编辑地址
   */
  githubUrl: string;
  
}

/**
 * 组件的 header
 */
export const CodeHeader: React.FC<any> = ({
  title,
  relativePath,
  githubUrl,
}) => {

  return (
    <PageHeader
      ghost={false}
      title={title}
      subTitle={
        <Tooltip title={useT('在 GitHub 上编辑')}>
          <a
            href={getGithubSourceUrl(githubUrl, relativePath, 'examples')}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.editOnGtiHubButton}
          >
            <EditOutlined />
          </a>
        </Tooltip>
      }
      extra={
        <Space split={<Divider type="vertical" />}></Space>
      }
    />
  )
}
