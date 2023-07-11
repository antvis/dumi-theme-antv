import React from 'react';
import { useIntl } from 'dumi';
import { InboxOutlined } from '@ant-design/icons';
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
  link: string;
}

const getHighlightInfo = (textSegments: ITextSegment[]) => {
  return <>
    {
      textSegments.map(
        segment => <span className={`${styles.segment} ${segment.highlighted ? styles.highlighted : ''}`} >{segment.text}</span>)
    }
  </>;
}

/**
 * 展示搜索结果
 * @returns
 */
export const SearchResult: React.FC<{ results: ISearchResult[] }> = ({ results }) => {
  const intl = useIntl();
  return (
    <div className={styles.searchResult} >
      {
        results?.length ? results.map((r) => {
          return (
            <div className={styles.item}>
              <div className={styles.subject} >{r.subject}</div>
              <div className={styles.br} />
              <a className={styles.result} href={r.link}>
                <div className={styles.title}>{getHighlightInfo(r.tilte)}</div>
                <div className={styles.description}>{getHighlightInfo(r.description)}</div>
              </a>
            </div>
          )
        }) : <div className={styles.empty}>
          <InboxOutlined style={{ fontSize: 20 }} />
          <div>{intl.formatMessage({ id: '没有找到查询结果' })}</div>
        </div>
      }
    </div>
  );
}