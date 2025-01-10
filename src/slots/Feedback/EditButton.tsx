import { EditOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useIntl, useRouteMeta, useSiteData } from 'dumi';
import path from 'path';
import React from 'react';
import { styled } from 'styled-components';

const StyledWrapper = styled.div`
  .button {
    color: rgba(0, 0, 0, 0.65);
  }
`;

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
    <StyledWrapper>
      <Button
        type="text"
        className="button"
        style={style}
        icon={<EditOutlined style={{ fontSize: 16, transform: 'translateY(2px)' }} />}
        onClick={() => window.open(url, '_blank')}
      >
        <span className="button-text">{formatMessage({ id: '帮助改进此文档' })}</span>
      </Button>
    </StyledWrapper>
  );
};
