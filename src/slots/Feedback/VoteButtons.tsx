import { DislikeFilled, LikeFilled } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useIntl } from 'dumi';
import React from 'react';
import { styled } from 'styled-components';
import { useSnapshot } from 'valtio';
import { feedbackStore, invokePageFeedback } from '../../model/feedback';

const StyledVoteButtonsWrapper = styled.div`
  color: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  gap: 4px;

  .button {
    color: rgba(0, 0, 0, 0.8);
  }

  .active-button {
    color: #873bf4;
    background-color: #f8f1ff;
  }
`;

export const VoteButtons: React.FC = () => {
  const { formatMessage } = useIntl();
  const feedbackState = useSnapshot(feedbackStore);

  const items = [
    {
      title: formatMessage({ id: 'yes' }),
      icon: <LikeFilled />,
      onClick: () => invokePageFeedback(true),
      isActive: feedbackState.rating === '1',
    },
    {
      title: formatMessage({ id: 'no' }),
      icon: <DislikeFilled />,
      onClick: () => invokePageFeedback(false),
      isActive: feedbackState.rating === '0',
    },
  ];

  return (
    <StyledVoteButtonsWrapper>
      <span>{formatMessage({ id: '此文档有帮助吗？' })}</span>
      {items.map(({ title, icon, onClick, isActive }) => (
        <Tooltip key={title} title={title}>
          <Button className={`button ${isActive ? 'active-button' : ''}`} type="text" icon={icon} onClick={onClick} />
        </Tooltip>
      ))}
    </StyledVoteButtonsWrapper>
  );
};
