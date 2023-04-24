import React from 'react';
import { Popover } from 'antd';
import { useIntl, useSiteSearch } from 'dumi';
import { SearchOutlined } from '@ant-design/icons';
import { SearchResult } from './SearchResult';
import { getSearchResults } from './helper';

import styles from './index.module.less';

export const Search = () => {
  const intl = useIntl();
  const { keywords, setKeywords, result } = useSiteSearch();

  return (
    <Popover open={!!keywords && !!result?.length} placement="topLeft" content={<SearchResult results={getSearchResults(result)} />}>
      <label className={styles.search} >
        <SearchOutlined className={styles.icon} />
        <input
          id="search"
          value={keywords}
          className={styles.input}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder={intl.formatMessage({
            id: '搜索…',
          })}
        />
      </label >
    </Popover>
  );
};
