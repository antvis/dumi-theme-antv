import { InboxOutlined } from '@ant-design/icons';
import { useIntl } from 'dumi';
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
  const intl = useIntl();
  return (
    <div className={styles.searchResult}>
      <div className={styles.item}>
        <div className={styles.subject}><img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*A-lcQbVTpjwAAAAAAAAAAAAADmJ7AQ/original" alt="AntV"/></div>
        <div className={styles.br}/>
        <a className={styles.result} href="/zh/ai-playground/2">
          <div className={styles.title}>{keywords}</div>
          <div className={styles.description}>试试AI可视化答疑</div>
        </a>
      </div>
      {results?.length && (
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
      )}
    </div>
  );
};
