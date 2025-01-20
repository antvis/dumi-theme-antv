import { FormOutlined } from '@ant-design/icons';
import { useIntl, useRouteMeta, useSiteData } from 'dumi';
import path from 'path';
import React from 'react';

export const EditButton: React.FC = () => {
  const meta = useRouteMeta();
  const { formatMessage } = useIntl();
  const { themeConfig } = useSiteData();
  const { githubUrl, branch = 'main', siteRelativePath = '/packages/site' } = themeConfig;
  const editable = !meta.frontmatter.readonly;

  if (!editable) {
    return null;
  }

  const branchUrl = `${githubUrl}/edit/${branch}`;

  const url = meta.frontmatter.redirect
    ? path.join(branchUrl, meta.frontmatter.redirect)
    : path.join(branchUrl, siteRelativePath, meta.frontmatter.filename || '');

  return (
    <a onClick={() => window.open(url, '_blank')}>
      <FormOutlined style={{ fontSize: 16, marginRight: 8 }} />
      <span className="button-text">{formatMessage({ id: '在 GitHub 上编辑此页' })}</span>
    </a>
  );
};
