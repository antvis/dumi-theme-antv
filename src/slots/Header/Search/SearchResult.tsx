import {useIntl, useSiteData} from 'dumi';
import React from 'react';
import styles from './SearchResult.module.less';
import classnames from "classnames";
import {AIChatStore, createNewSession} from "../../../model/AIChat";


export type ITextSegment = {
  text: string;
  highlighted?: boolean;
};

export type ISearchResult = {
  /**
   * 搜索结果的主题，显示在最左边，一般是页面的标题。
   */
  subject: string;
  title: ITextSegment[];
  description?: ITextSegment[];
  link: string;
};

const getHighlightInfo = (textSegments: ITextSegment[]) => {
  return (
    <>
      {textSegments.map((segment) => (
        <span className={`${styles.segment} ${segment.highlighted ? styles.highlighted : ''}`}>{segment.text}</span>
      ))}
    </>
  );
};

/**
 * 展示搜索结果
 * @returns
 */
export const SearchResult: React.FC<{ results: ISearchResult[], keywords: string }> = ({ results, keywords }) => {
  const { themeConfig } = useSiteData();
  const intl = useIntl();
  return (
    <div className={styles.searchResult}>
      <div className={styles.item}>
        <div className={styles.subject}><img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*7svFR6wkPMoAAAAAAAAAAAAADmJ7AQ/original" alt="AntV"/></div>
        <div className={styles.br}/>
        <a className={styles.result} onClick={() => {
          createNewSession({
            promptText: keywords,
            mode: "solve",
            lib: !themeConfig.isAntVSite ? themeConfig.title : undefined,
            jump: true,
            lang: intl.locale === 'zh' ? 'zh' : 'en'
          })
        }}>
          <div className={classnames(styles.title, styles.highlighted)}>{keywords}</div>
          <div className={styles.description}>
            {intl.formatMessage({ id: 'ai.search.try' })}
            &nbsp;<span className={styles.highlighted}>AI</span>&nbsp;
            {intl.formatMessage({ id: 'ai.search.visualization' })}
          </div>
        </a>
      </div>
      {results?.length ? (
        results.map((r, index) => {
          return (
            <div className={styles.item} key={index}>
              <div className={styles.subject}>{r.subject}</div>
              <div className={styles.br}/>
              <a className={styles.result} href={r.link}>
                <div className={styles.title}>{getHighlightInfo(r.title)}</div>
                <div className={styles.description}>{getHighlightInfo(r.description)}</div>
              </a>
            </div>
          );
        })
      ): <></>}
    </div>
  );
};
