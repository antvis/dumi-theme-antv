import cx from 'classnames';
import { useLocale } from 'dumi/dist/client/theme-api';
import gh from 'parse-github-url';
import React, { useEffect, useState } from 'react';
import GitHubButton from 'react-github-button';
import { News, NewsProps } from './News';

import { ic } from '../hooks';
import type { IC } from '../../types';
import styles from './index.module.less';
import {HomeDialog} from "../../components/AI/HomeDialog";

type DetailButtonProps = {
  text: IC;
  link: string;
  style?: React.CSSProperties;
  type?: string;
  shape?: 'round' | 'square';
  icon?: string;
};

type DetailProps = {
  className?: string;
  style?: React.CSSProperties;
  title: IC;
  engine?: IC;
  description: IC;
  image?: string;
  imageStyle?: React.CSSProperties;
  buttons?: DetailButtonProps[];
  githubUrl: string;
  showGithubStars?: boolean;
  news: NewsProps[];
};

/**
 * Index.技术栈的描述区域！
 * 各自配置
 */
export const Detail: React.FC<DetailProps> = ({
  className,
  style,
  title,
  engine,
  description,
  image,
  imageStyle,
  githubUrl,
  showGithubStars = true,
  buttons = [],
  news,
  ...v
}) => {
  const [remoteNews, setRemoteNews] = useState<NewsProps[]>([]);
  const lang = useLocale().id;

  useEffect(() => {
    fetch(
      'https://assets.antv.antgroup.com/antv/banner-messages.json', // 生产环境
      // 'https://site-data-pre.alipay.com/antv/banner-messages.json', // 预发测试
    )
      .then((res) => res.json())
      .then((data) => {
        setRemoteNews(data);
      })
      .catch((e) => {
        setRemoteNews([]);
      });
  }, []);

  const githubObj = gh(githubUrl);
  const showGitHubStarsButton = showGithubStars && githubObj && githubObj.owner && githubObj.name;

  const engineText = ic(engine);

  return (
    <section className={cx(styles.wrapper, className)} style={style}>
      <div className={styles.content}>
        <div className={styles.text}>
          <div className={styles.titleButtons}>
            <div className={cx(styles.title, 'detail-title')}>
              <span className={cx(styles.engine, 'detail-engine')}>{engineText}</span>
              {ic(title).replace(engineText, '')}
            </div>
            <div className={cx(styles.buttons, 'detail-buttons')}>
              {showGitHubStarsButton && (
                <div key="github" className={styles.githubWrapper}>
                  <GitHubButton type="stargazers" size="large" namespace={githubObj.owner} repo={githubObj.name} />
                </div>
              )}
            </div>
          </div>
        </div>
        <HomeDialog style={{margin: "140px auto"}}/>
        {/** 新闻公告 */}
        <div className={cx(styles.news, 'news')}>
          {(news || remoteNews).slice(0, 3).map((n, i) => (
            <News key={i} index={i} {...n} />
          ))}
        </div>
        {/** image */}
        <div className={cx(styles.teaser, 'teaser')}>
          <div className={cx(styles.teaserimg, 'teaser-img')}>
            <img width="100%" style={{ marginLeft: '100px', marginTop: '40px', ...imageStyle }} src={image} />
          </div>
        </div>
        <img
          className={styles.backLeftBottom}
          src="https://gw.alipayobjects.com/zos/basement_prod/441d5eaf-e623-47cd-b9b9-2a581d9ce1e3.svg"
          alt="back"
        />
      </div>
    </section>
  );
};
