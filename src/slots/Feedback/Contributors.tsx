import { useIntl, useSiteData } from 'dumi';
import path from 'path';
import React from 'react';
import styled from 'styled-components';
import ContributorsList from '../../common/AvatarList';
import { ContributorAvatar } from './ContributorAvatar';

const StyledContributorsWrapper = styled.div`
  margin-top: 80px;

  .title {
    font-size: 13px;
    color: #bfbfbf;
    margin-bottom: 12px;
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

interface ContributorsProps {
  filename?: string;
}

export const Contributors: React.FC<ContributorsProps> = ({ filename }) => {
  const { formatMessage } = useIntl();
  const { themeConfig } = useSiteData();
  const { githubUrl, branch = 'main', siteRelativePath } = themeConfig;

  const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
  const [, owner, repo] = githubUrl.match(regex);

  if (!filename) {
    return null;
  }

  return (
    <StyledContributorsWrapper>
      <div className="title">{formatMessage({ id: '文档贡献者' })}</div>
      <ContributorsList
        cache
        repo={repo}
        owner={owner}
        fileName={path.join(siteRelativePath, filename)}
        className="list"
        renderItem={(item, loading) => <ContributorAvatar item={item} loading={loading} key={item?.url} />}
        branch={branch}
      />
    </StyledContributorsWrapper>
  );
};
