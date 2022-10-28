import React from 'react';
import { Tag } from 'antd';
import { useLocale } from 'dumi';

const ReadingTime: React.FC<any> = ({ readingTime }) => {
  return (
    <Tag>
        阅读时间约 {Math.ceil(readingTime/ 60000)} 分钟
    </Tag>
  );
};

export default ReadingTime;
