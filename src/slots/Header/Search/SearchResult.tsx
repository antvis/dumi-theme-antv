import React from 'react';
import styles from './SearchResult.module.less';

export type ITextSegment = {
  text: string;
  highlighted?: boolean;
};

export type ISearchResult = {
  /**
   * 搜索结果的主题，显示在最左边，一般是页面的标题。
   */
  subject: string;
  tilte: ITextSegment[];
  description?: ITextSegment[];
}

const getHighlightInfo = (textSegments: ITextSegment[]) => {
  return <>
    {
      textSegments.map(segment => <span className={segment.highlighted ? styles.highlighted : ''} >{segment.text}</span>)
    }
  </>;
}

/**
 * 展示搜索结果
 * @returns
 */
export const SearchResult = ({ results }) => {
  return (
    <div className={styles.searchResult} >
      {results.map((r) => {
        return (
          <a className={styles.item} href={r.link} >
            <div className={styles.subject} >{r.subject}</div>
            <div className={styles.br} />
            <div className={styles.result}>
              <div className={styles.title}>{getHighlightInfo(r.tilte)}</div>
              <div className={styles.description}>{getHighlightInfo(r.description)}</div>
            </div>
          </a>
        )
      })}
    </div>
  );
}