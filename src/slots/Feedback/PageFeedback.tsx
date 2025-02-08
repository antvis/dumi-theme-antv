import React from 'react';
import { styled } from 'styled-components';
import { PageFeedbackReasonForm } from './PageFeedbackReasonForm';
import { PageFeedbackVoteButtons } from './PageFeedbackVoteButtons';

const StyledWrapper = styled.div`
  background-color: #fff;
  border-radius: 12px;
  bottom: 24px;
  box-shadow: 0 0.5rem 1.2rem #f0f1f2;
  padding: 10px 18px;
  position: fixed;
  right: 12px;
  width: 262px;
  z-index: 1000;
`;

export const PageFeedback: React.FC = () => {
  return (
    <StyledWrapper>
      <PageFeedbackVoteButtons />
      <PageFeedbackReasonForm />
    </StyledWrapper>
  );
};
