import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import gh from 'parse-github-url';
import GitHubButton from 'react-github-button';
import { useLocale } from 'dumi/dist/client/theme-api';

import { ic } from '../hooks';
import { IC } from '../../types';
import { News, NewsProps } from './News';

import styles from './index.module.less';

type DetailButtonProps = {
  text: IC;
  link: string;
  style?: React.CSSProperties;
  type?: string;
  shape?: 'round' | 'square';
}

type DetailProps = {
  className?: string;
  style?: React.CSSProperties;
  title: IC;
  engine?: IC;
  description: IC;
  image?: string;
  buttons?: DetailButtonProps[];
  githubUrl: string;
  showGithubStars?: boolean;
  news: NewsProps[];
}

const AssetsNewsURL = 'https://assets.antv.antgroup.com/antv/news.json';

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
  githubUrl,
  showGithubStars = true,
  buttons = [],
  news,
  ...v
}) => {
  const [remoteNews, setRemoteNews] = useState<NewsProps[]>([]);
  const lang = useLocale().id
  console.log(v);
  useEffect(() => {
    fetch(AssetsNewsURL)
      .then((res) => res.json())
      .then((data) => {
        setRemoteNews(data);
      }).catch(e => {
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
          <div className={cx(styles.title, 'detail-title')}>
            <span className={cx(styles.engine, 'detail-engine')}>{engineText}</span>{ic(title).replace(engineText, '')}
          </div>
          <div className={cx(styles.description, 'detail-description')}>
            {ic(description)}
          </div>
          {/** buttons  */}
          <div className={cx(styles.buttons, 'detail-buttons')}>
            {
              buttons.map(({ type, style, text, link, shape }) => {
                return (
                  <a
                    key={ic(text)}
                    className={cx(
                      styles.buttonLink,
                      styles[type || ''],
                      type === 'primary' ? 'primary-button' : 'common-button'
                    )}
                    style={{
                      borderRadius: shape === 'round' ? '1000px' : '12px',
                      ...style,
                    }}
                    href={link[lang] ? link[lang] : link}
                  >
                    <div className={styles.icon} />
                    <span className={styles.button}>{ic(text)}</span>
                  </a>
                )
              })
            }
            {
              showGitHubStarsButton && <div key='github' className={styles.githubWrapper}>
                <GitHubButton
                  type='stargazers'
                  size='large'
                  namespace={githubObj.owner}
                  repo={githubObj.name}
                />
              </div>
            }
          </div>
        </div>
        {/** 新闻公告 */}
        <div className={cx(styles.news, 'news')}>
          {
            (news || remoteNews).slice(0, 2).map((n, i) => (<News key={i} index={i} {...n} />))
          }
        </div>
        {/** image */}
        <div className={cx(styles.teaser, 'teaser')}>
          <div className={cx(styles.teaserimg, 'teaser-img')}>
            <img width="100%" style={{ marginLeft: '100px', marginTop: '40px' }} src={image} />
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
