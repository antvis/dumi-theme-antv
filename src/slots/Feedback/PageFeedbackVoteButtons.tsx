import { DislikeFilled, LikeFilled } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useIntl } from 'dumi';
import React from 'react';
import { styled } from 'styled-components';
import { useSnapshot } from 'valtio';
import { feedbackStore, invokePageFeedback, resetFeedbackState, resetPageFeedback } from '../../model/feedback';

const StyledVoteButtonsWrapper = styled.div`
  color: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;

  .button {
    color: rgba(0, 0, 0, 0.65);
  }

  .active-button {
    color: #873bf4;
    background-color: #f8f1ff;
  }
`;

export const PageFeedbackVoteButtons: React.FC = () => {
  const { formatMessage } = useIntl();
  const feedbackState = useSnapshot(feedbackStore);

  const items = [
    {
      title: formatMessage({ id: 'yes' }),
      icon: <LikeFilled />,
      onClick: () => {
        if (feedbackState.rating === '1') {
          resetPageFeedback();
        } else {
          invokePageFeedback(true);
        }
      },
      isActive: feedbackState.rating === '1',
    },
    {
      title: formatMessage({ id: 'no' }),
      icon: <DislikeFilled />,
      onClick: () => {
        if (feedbackState.rating === '0') {
          resetPageFeedback();
        } else {
          invokePageFeedback(false);
        }
      },
      isActive: feedbackState.rating === '0',
    },
  ];

  return (
    <StyledVoteButtonsWrapper>
      <span>{formatMessage({ id: '这个页面对你有帮助吗？' })}</span>
      {items.map(({ title, icon, onClick, isActive }) => (
        <Tooltip key={title} title={title}>
          <Button className={`button ${isActive ? 'active-button' : ''}`} type="text" icon={icon} onClick={onClick} />
        </Tooltip>
      ))}
    </StyledVoteButtonsWrapper>
  );
};
