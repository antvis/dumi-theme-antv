import { useRouteMeta } from 'dumi';
import React from 'react';
import { styled } from 'styled-components';
import { Contributors } from './Contributors';
import { EditButton } from './EditButton';
import { PageFeedback } from './PageFeedback';
import { SectionFeedback } from './SectionFeedback';

const StyledWrapper = styled.div`
  margin-top: 40px;
`;

export const Feedback: React.FC = () => {
  const meta = useRouteMeta();

  const editable = !meta.frontmatter.readonly;

  return (
    <StyledWrapper>
      {editable && <EditButton style={{ transform: 'translateX(-12px)' }} />}
      {editable && <Contributors filename={meta.frontmatter.filename} />}
      <SectionFeedback />
      <PageFeedback />
    </StyledWrapper>
  );
};
