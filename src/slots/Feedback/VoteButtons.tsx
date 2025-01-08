import { DislikeFilled, LikeFilled } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useIntl } from 'dumi';
import React from 'react';
import { styled } from 'styled-components';

const StyledVoteButtonsWrapper = styled.div`
  color: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  gap: 4px;

  .button {
    color: rgba(0, 0, 0, 0.8);
  }
`;

export const VoteButtons: React.FC = () => {
  const { formatMessage } = useIntl();

  const items = [
    {
      title: formatMessage({ id: 'yes' }),
      icon: <LikeFilled />,
    },
    {
      title: formatMessage({ id: 'no' }),
      icon: <DislikeFilled />,
    },
  ];

  return (
    <StyledVoteButtonsWrapper>
      <span>{formatMessage({ id: '此文档有帮助吗？' })}</span>
      {items.map(({ title, icon }) => (
        <Tooltip key={title} title={title}>
          <Button className="button" type="text" icon={icon} />
        </Tooltip>
      ))}
    </StyledVoteButtonsWrapper>
  );
};
