import { useRouteMeta } from 'dumi';
import React from 'react';
import { styled } from 'styled-components';
import { Contributors } from './Contributors';
import { EditButton } from './EditButton';

const StyledWrapper = styled.div`
  margin-top: 32px;
`;

export const Feedback: React.FC = () => {
  const meta = useRouteMeta();

  if (meta.frontmatter.readonly) {
    return null;
  }

  return (
    <StyledWrapper>
      <EditButton style={{ transform: 'translateX(-12px)' }} />
      <Contributors filename={meta.frontmatter.filename} />
    </StyledWrapper>
  );
};
