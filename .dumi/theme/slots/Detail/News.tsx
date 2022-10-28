import React from 'react';
import { Link } from 'dumi';
import { ic } from '../hooks';
import styles from './News.module.less';

export interface NewsProps {
  index?: number;
  type: IC;
  title: IC;
  date: string;
  link: string;
}

const numberImages = [
  'https://gw.alipayobjects.com/zos/antfincdn/IqREAm36K7/1.png',
  'https://gw.alipayobjects.com/zos/antfincdn/3fG1Iqjfnz/2.png',
];

export const News: React.FC<NewsProps> = ({
  index = 0,
  type,
  title,
  date,
  link = '',
}) => {
  const children = (
    <div className={styles.container}>
      <img
        className={styles.number}
        src={numberImages[index]}
        alt={index.toString()}
      />
      <div className={styles.content}>
        <p className={styles.description}>
          {ic(type)} ‧ {ic(title)}
        </p>
        <p className={styles.date}>{date}</p>
      </div>
    </div>
  );
  if (link.startsWith('http')) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.news}
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={link} className={styles.news}>
      {children}
    </Link>
  );
};
