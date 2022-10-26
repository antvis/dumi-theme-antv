import React from 'react';
import { Tag } from 'antd';
import { useLocale } from 'dumi';

const ReadingTime: React.FC<any> = ({ readingTime }) => {
  const locale=useLocale()
  const { text = '', time = 0 } = readingTime;
  return (
    <Tag>
      {locale.id === 'zh'
        ? text.replace(/(\d+)\smin\sread/, (_: string, min: string) => {
          if (min) {
            return `阅读时间约 ${min} 分钟`;
          }
          return `阅读时间约 ${Math.ceil(time / 60000)} 分钟`;
        })
        : text}
    </Tag>
  );
};

export default ReadingTime;
