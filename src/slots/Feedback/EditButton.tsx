import { FormOutlined } from '@ant-design/icons';
import { useIntl, useRouteMeta, useSiteData } from 'dumi';
import React from 'react';
import { useGithubRepo } from '../../utils/github';

export const EditButton: React.FC = () => {
  const meta = useRouteMeta();
  const { formatMessage } = useIntl();
  const { themeConfig } = useSiteData();
  const { githubUrl, sitePackagePath = 'site' } = themeConfig;
  const { defaultBranch } = useGithubRepo();
  const editable = !meta.frontmatter.readonly;

  if (!editable) {
    return null;
  }

  const branchUrl = `${githubUrl}/edit/${defaultBranch}`;

  const url = meta.frontmatter.redirect
    ? `${branchUrl}/${meta.frontmatter.redirect}`
    : `${branchUrl}/${sitePackagePath}/${meta.frontmatter.filename || ''}`;

  return (
    <a onClick={() => window.open(url, '_blank')}>
      <FormOutlined style={{ fontSize: 16, marginRight: 8 }} />
      <span className="button-text">{formatMessage({ id: '在 GitHub 上编辑此页' })}</span>
    </a>
  );
};
