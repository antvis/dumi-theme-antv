import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Popover } from 'antd';
import { useIntl, useSiteSearch } from 'dumi';
import { SearchOutlined } from '@ant-design/icons';
import { SearchResult } from './SearchResult';
import { getSearchResults } from './helper';

import styles from './index.module.less';

export const Search = () => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const { keywords, setKeywords, result } = useSiteSearch();

  const onClose = useCallback(_.debounce(() => setOpen(false), 200), []);

  useEffect(() => {
    setOpen(!!keywords && !!result?.length);
  }, [result, keywords]);

  return (
    <Popover open={open} placement="topLeft" content={<SearchResult results={getSearchResults(result)} />}>
      <label className={styles.search} >
        <SearchOutlined className={styles.icon} />
        <input
          id="search"
          value={keywords}
          className={styles.input}
          onBlur={() => onClose()}
          onFocus={() => setOpen(!!keywords && !!result?.length)}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder={intl.formatMessage({
            id: '搜索…',
          })}
        />
      </label >
    </Popover>
  );
};
