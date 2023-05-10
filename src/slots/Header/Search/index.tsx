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
  const onClose = useCallback(() => setTimeout(() => setOpen(false), 100), []);
  const { keywords, setKeywords, result } = useSiteSearch();

  useEffect(() => {
    setOpen(!!result?.length);
  }, [result]);

  return (
    <Popover open={open} placement="topLeft" content={<SearchResult results={getSearchResults(result)} />}>
      <label className={styles.search} >
        <SearchOutlined className={styles.icon} />
        <input
          className={styles.input}
          value={keywords}
          autoComplete="off"
          onBlur={() => onClose()}
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
