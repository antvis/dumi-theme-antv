import { Popover } from 'antd';
import { debounce } from 'lodash';
import { useIntl, useSiteSearch } from 'dumi';
import { SearchOutlined } from '@ant-design/icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import styles from './index.module.less';

export const Search = () => {
  const intl = useIntl();
  const [open, setOpen] = useState<boolean>(false);
  const { keywords, setKeywords, result, loading } = useSiteSearch();

  const onClose = useCallback(debounce(() => setOpen(false), 200), []);

  useEffect(() => {
    setOpen(!!result?.length);
  }, [result])

  // 高亮和正常文本
  const highLightTitleItem = (texts) => texts.map(item => item.highlighted ? <span className={styles.hightText} >{item.text}</span> : item.text);

  const highLightTitle = (hint) => {
    const { highlightTitleTexts, highlightTexts } = hint;
    return <div className={styles.content}>
      <div className={styles.titleText}>
        {highLightTitleItem(highlightTitleTexts)}
      </div>
      <div className={styles.text}>
        {highLightTitleItem(highlightTexts)}
      </div>
    </div>
  };

  const renderSearch = useMemo(() => {
    return !!result?.length && <div className={styles.searchResult} >
      {result.map((r) => {
        return <a className={styles.resultItem} href={r.hints[0].link} >
          <div className={styles.title} >{r.title}</div>
          <div className={styles.br} />
          {highLightTitle(r.hints[0])}
        </a>
      })}
    </div>
  }, [result, loading]);

  return (
    <Popover open={open} placement="topLeft" content={renderSearch}>
      <label className={styles.search} >
        <SearchOutlined className={styles.icon} />
        <input
          className={styles.input}
          id="search"
          value={keywords}
          onBlur={() => onClose()}
          onFocus={() => setOpen(!!result?.length)}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder={intl.formatMessage({
            id: '搜索…'
          })}
        />
      </label >
    </Popover>
  );
};
