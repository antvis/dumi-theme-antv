import { useSiteData } from 'dumi';
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
  const { themeConfig } = useSiteData();
  const { feedback } = themeConfig;

  if (!feedback) {
    return null;
  }

  return (
    <StyledWrapper>
      <EditButton />
      <Contributors />
      <SectionFeedback />
      <PageFeedback />
    </StyledWrapper>
  );
};
