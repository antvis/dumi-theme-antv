import React, { useEffect, useState, useMemo } from 'react';
import { Popover } from 'antd';
import { useIntl, useSiteSearch } from 'dumi';
import { SearchOutlined } from '@ant-design/icons';
import { SearchResult } from './SearchResult';
import { getSearchResults } from './helper';

import styles from './index.module.less';

export const Search = () => {
  const intl = useIntl();
  const [open, setOpen] = useState<boolean>(false);
  // useSiteSearch 错误 keywords 为空时 loading 为 true
  const { keywords, setKeywords, result, loading } = useSiteSearch();

  useEffect(() => {
    // keywords 为空 或 loading 为 false 查找结束， 进行开关
    if (!keywords || !loading) {
      setOpen(!!keywords);
    }
  }, [keywords, loading]);

  useEffect(() => {
    const close = (e: any) => {
      const className = e.target?.className;
      if (!(typeof className === 'string' && className.match(styles.input))) {
        setOpen(false);
      }
    }
    if (window) {
      window.addEventListener('click', close);
    }
    return () => {
      window.removeEventListener('click', close);
    }
  }, []);

  const searchResults = useMemo(() => getSearchResults(result), [result]);

  return (
    <Popover open={open} placement="topLeft" destroyTooltipOnHide={{ keepParent: false }} content={<SearchResult results={searchResults} />}>
      <label className={styles.search} >
        <SearchOutlined className={styles.icon} />
        <input
          className={styles.input}
          value={keywords}
          autoComplete="off"
          onFocus={() => setOpen(!!result?.length)}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder={intl.formatMessage({
            id: '搜索…',
          })}
        />
      </label >
    </Popover>
  );
};
