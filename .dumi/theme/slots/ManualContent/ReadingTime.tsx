import React from 'react';
import { Tag } from 'antd';
import { useT } from '../hooks';

const ReadingTime: React.FC<any> = ({ readingTime }) => {
  return (
    <Tag>
      {`${useT('阅读时间约')} ${Math.ceil(readingTime / 60000)} ${useT('分钟')}`}
    </Tag>
  );
};

export default ReadingTime;
