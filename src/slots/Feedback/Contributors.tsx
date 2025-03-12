import { useIntl, useRouteMeta, useSiteData } from 'dumi';
import path from 'path';
import React from 'react';
import styled from 'styled-components';
import ContributorsList from '../../common/AvatarList';
import { useGithubRepo } from '../../utils/github';
import { ContributorAvatar } from './ContributorAvatar';

const StyledContributorsWrapper = styled.div`
  margin-top: 80px;

  .title {
    margin-bottom: 14px;
    color: #bfbfbf;
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    clear: both;
    li {
      height: 24px;
      transition: all 0.3s;
      margin-inline-end: -8px;
    }
    &:hover {
      li {
        margin-inline-end: 0;
      }
    }
  }
`;

const Contributors: React.FC = () => {
  const { formatMessage } = useIntl();
  const { sitePackagePath = '/packages/site' } = useSiteData().themeConfig;
  const { owner, repo, defaultBranch } = useGithubRepo();
  const meta = useRouteMeta();
  const editable = !meta.frontmatter.readonly;

  if (!editable || !meta.frontmatter.filename) {
    return null;
  }

  return (
    <StyledContributorsWrapper>
      <div className="title">{formatMessage({ id: '文档贡献者' })}</div>
      <ContributorsList
        cache
        repo={repo}
        owner={owner}
        fileName={path.join(sitePackagePath, meta.frontmatter.filename)}
        className="list"
        renderItem={(item, loading) => <ContributorAvatar item={item} loading={loading} key={item?.url} />}
        branch={defaultBranch}
      />
    </StyledContributorsWrapper>
  );
};

export default Contributors;
