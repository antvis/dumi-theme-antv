import { useRouteMeta } from 'dumi';
import React from 'react';
import { styled } from 'styled-components';
import { Contributors } from './Contributors';
import { EditButton } from './EditButton';
import { FeedbackMessage } from './FeedbackMessage';
import { VoteButtons } from './VoteButtons';

const StyledWrapper = styled.div`
  margin-top: 40px;

  .buttons {
    display: flex;
    justify-content: space-between;
  }
`;

export const Feedback: React.FC = () => {
  const meta = useRouteMeta();

  const editable = !meta.frontmatter.readonly;

  return (
    <StyledWrapper>
      <div className="buttons">
        {editable ? <EditButton style={{ transform: 'translateX(-12px)' }} /> : <div />}
        <VoteButtons />
      </div>
      <FeedbackMessage />
      {editable ? <Contributors filename={meta.frontmatter.filename} /> : null}
    </StyledWrapper>
  );
};
