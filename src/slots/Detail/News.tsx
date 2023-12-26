import React from 'react';
import { Link, useLocale } from 'dumi';
import { ic } from '../hooks';
import { IC } from '../../types';
import styles from './News.module.less';

export interface NewsProps {
  index?: number;
  type: IC;
  title: IC;
  date: string;
  link: string;
  subTitle?: string;
  img?: string;
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
  subTitle,
  img,
  link = '',
}) => {
  const lang = useLocale().id
  const children = (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.description}>
          {img && <img src={img} alt='message_title' />}
          {type ? `${ic(type)} ‧ ` : ''}{ic(title)}
        </p>
        {date && <p className={styles.date}>{date}</p>}
        {subTitle && <p className={styles.subTitle}>{ic(subTitle)}</p>}
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
    <Link to={link[lang] ? link[lang] : link} className={styles.news}>
      {children}
    </Link>
  );
};
