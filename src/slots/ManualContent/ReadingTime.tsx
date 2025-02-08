import { Tag } from 'antd';
import { FormattedMessage } from 'dumi';
import React from 'react';

const ReadingTime: React.FC<any> = ({ readingTime }) => {
  return (
    <Tag>
      <FormattedMessage id="阅读时间约" /> {Math.ceil(readingTime / 60000)} <FormattedMessage id="分钟" />
    </Tag>
  );
};

export default ReadingTime;
