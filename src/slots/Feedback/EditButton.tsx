import { GithubOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useIntl, useRouteMeta, useSiteData } from 'dumi';
import path from 'path';
import React from 'react';

interface EditButtonProps {
  style?: React.CSSProperties;
}

export const EditButton: React.FC<EditButtonProps> = ({ style }) => {
  const meta = useRouteMeta();
  const { formatMessage } = useIntl();
  const { themeConfig } = useSiteData();
  const { githubUrl, branch = 'main', siteRelativePath } = themeConfig;

  const branchUrl = `${githubUrl}/edit/${branch}`;

  const url = meta.frontmatter.redirect
    ? path.join(branchUrl, meta.frontmatter.redirect)
    : path.join(branchUrl, siteRelativePath, meta.frontmatter.filename || '');

  return (
    <Button
      type="text"
      style={{ borderRadius: 8, ...style }}
      icon={<GithubOutlined style={{ fontSize: 18, transform: 'translateY(1px)' }} />}
      onClick={() => window.open(url, '_blank')}
    >
      <span style={{ textDecoration: 'underline' }}>{formatMessage({ id: '帮助改进此文档' })}</span>
    </Button>
  );
};
