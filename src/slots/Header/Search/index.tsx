import React, { useCallback, useEffect, useState } from 'react';
import { Popover } from 'antd';
import { debounce } from 'lodash';
import { useIntl, useSiteSearch } from 'dumi';
import { SearchOutlined } from '@ant-design/icons';
import { SearchResult } from './SearchResult';
import { getSearchResults } from './helper';

import styles from './index.module.less';

export const Search = () => {
  const intl = useIntl();
  const [open, setOpen] = useState<boolean>(false);
  const { keywords, setKeywords, result, loading } = useSiteSearch();

  const onClose = useCallback(debounce(() => setOpen(false), 200), []);

  useEffect(() => {
    setOpen(!!result?.length);
  }, [result])

  return (
    <Popover open={open} placement="topLeft" content={<SearchResult results={getSearchResults(result)} />}>
      <label className={styles.search} >
        <SearchOutlined className={styles.icon} />
        <input
          className={styles.input}
          id="search"
          value={keywords}
          // onBlur={() => onClose()}
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
