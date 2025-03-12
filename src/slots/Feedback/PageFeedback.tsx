import React from 'react';
import { styled } from 'styled-components';
import { PageFeedbackReasonForm } from './PageFeedbackReasonForm';
import { PageFeedbackVoteButtons } from './PageFeedbackVoteButtons';

const StyledWrapper = styled.div`
  margin: 2px 4px 8px 4px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  padding: 10px 12px;
  width: fit-content;
  background-color: #fff;
  font-size: 14px;
`;

const PageFeedback: React.FC = () => {
  return (
    <StyledWrapper>
      <PageFeedbackVoteButtons />
      <PageFeedbackReasonForm />
    </StyledWrapper>
  );
};

export default PageFeedback;
